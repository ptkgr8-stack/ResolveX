
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.auth import _get_current_user
from app.core.database import get_db
from app.models.issue import Issue
from app.models.user import User
from app.schemas.issue import IssueCreate, IssueResponse, IssueStatusUpdate

router = APIRouter(prefix="/api/issues", tags=["Issues"])

ALLOWED_STATUSES = {
    "Reported",
    "Under Review",
    "In Progress",
    "Resolved",
    "Rejected",
}


def estimate_priority(category: str, description: str) -> str:
    """Initial transparent baseline; replace with ML predictions later."""
    text = f"{category} {description}".lower()

    critical_terms = [
        "fire", "electrocution", "electric shock",
        "gas leak", "structural collapse",
    ]
    high_terms = [
        "exposed wire", "short circuit", "flooding",
        "severe leak", "broken glass", "unsafe",
    ]

    if any(term in text for term in critical_terms):
        return "Critical"

    if any(term in text for term in high_terms):
        return "High"

    if category.lower() in {"electrical", "safety", "security"}:
        return "High"

    return "Medium"


@router.post("", response_model=IssueResponse, status_code=201)
def create_issue(
    payload: IssueCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(_get_current_user),
):
    priority = estimate_priority(payload.category, payload.description)

    issue = Issue(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        location=payload.location,
        priority=priority,
        status="Reported",
    )

    db.add(issue)
    db.commit()
    db.refresh(issue)
    return issue


@router.get("", response_model=list[IssueResponse])
def list_issues(
    status_filter: str | None = Query(default=None, alias="status"),
    category: str | None = None,
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(_get_current_user),
):
    query = db.query(Issue)

    if status_filter:
        query = query.filter(Issue.status == status_filter)

    if category:
        query = query.filter(Issue.category.ilike(category))

    return query.order_by(Issue.created_at.desc()).limit(limit).all()


@router.get("/{issue_id}", response_model=IssueResponse)
def get_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(_get_current_user),
):
    issue = db.query(Issue).filter(Issue.id == issue_id).first()

    if issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")

    return issue


@router.patch("/{issue_id}/status", response_model=IssueResponse)
def update_issue_status(
    issue_id: int,
    payload: IssueStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(_get_current_user),
):
    if current_user.role not in {"admin", "faculty"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only authorized staff can update issue statuses",
        )

    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Status must be one of: {', '.join(sorted(ALLOWED_STATUSES))}",
        )

    issue = db.query(Issue).filter(Issue.id == issue_id).first()

    if issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")

    issue.status = payload.status
    db.commit()
    db.refresh(issue)
    return issue
