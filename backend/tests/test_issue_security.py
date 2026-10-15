
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import get_db
from app.api.auth import _get_current_user


client = TestClient(app)


def test_student_cannot_update_issue_status():
    """
    A student must receive 403 when trying to update an issue status.
    This verifies the role restriction without modifying the database.
    """
    from types import SimpleNamespace

    student = SimpleNamespace(
        id=5,
        role="student",
        is_active=True,
    )

    app.dependency_overrides[_get_current_user] = lambda: student

    try:
        response = client.patch(
            "/api/issues/6/status",
            json={"status": "Resolved"},
        )

        assert response.status_code == 403
        assert response.json()["detail"] == (
            "Only authorized staff can update issue statuses"
        )
    finally:
        app.dependency_overrides.clear()


def test_issue_endpoints_require_authentication():
    """
    Unauthenticated requests must not access issue endpoints.
    """
    response = client.get(
        "/api/issues",
        headers={"Authorization": "Bearer invalid-test-token"},
    )

    assert response.status_code == 401


def test_student_cannot_access_another_students_issue():
    """
    A student must not retrieve an issue owned by another student.
    """
    from types import SimpleNamespace

    from sqlalchemy.orm import Session

    student_a = SimpleNamespace(
        id=5,
        role="student",
        is_active=True,
    )

    class FakeQuery:
        def filter(self, *args, **kwargs):
            return self

        def first(self):
            return None

    class FakeDB:
        def query(self, model):
            return FakeQuery()

    app.dependency_overrides[_get_current_user] = lambda: student_a
    app.dependency_overrides[get_db] = lambda: FakeDB()

    try:
        response = client.get("/api/issues/6")

        assert response.status_code == 404
        assert response.json()["detail"] == "Issue not found"
    finally:
        app.dependency_overrides.clear()

def test_staff_can_update_issue_status():
    from datetime import datetime
    from types import SimpleNamespace

    staff = SimpleNamespace(id=10, role="faculty", is_active=True)

    issue = SimpleNamespace(
        id=6,
        title="Test campus issue",
        description="Testing staff status updates",
        category="Maintenance",
        location="Block A",
        priority="Medium",
        status="Reported",
        predicted_category=None,
        reporter_id=5,
        created_at=datetime.now(),
    )

    class FakeQuery:
        def filter(self, *args, **kwargs):
            return self

        def first(self):
            return issue

    class FakeDB:
        committed = False

        def query(self, model):
            return FakeQuery()

        def commit(self):
            self.committed = True

        def refresh(self, obj):
            pass

    fake_db = FakeDB()

    app.dependency_overrides[_get_current_user] = lambda: staff
    app.dependency_overrides[get_db] = lambda: fake_db

    try:
        response = client.patch(
            "/api/issues/6/status",
            json={"status": "Resolved"},
        )

        assert response.status_code == 200
        assert response.json()["status"] == "Resolved"
        assert issue.status == "Resolved"
        assert fake_db.committed is True
    finally:
        app.dependency_overrides.clear()
