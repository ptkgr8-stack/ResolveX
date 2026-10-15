
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path

import jwt
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.email_service import send_otp_email
from app.models.user import User
from app.schemas.auth import (
    ResendOTP,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
    VerifyOTP,
)

# Load backend/.env
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

password_hash = PasswordHash.recommended()
bearer_scheme = HTTPBearer(auto_error=False)

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"

OTP_EXPIRY_MINUTES = 5
OTP_RESEND_COOLDOWN_SECONDS = 60
OTP_MAX_ATTEMPTS = 5


def _secret_key() -> str:
    if not JWT_SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT_SECRET_KEY is missing from backend/.env",
        )
    return JWT_SECRET_KEY


def _hash_otp(otp: str) -> str:
    return hmac.new(
        _secret_key().encode(),
        otp.encode(),
        hashlib.sha256,
    ).hexdigest()


def _create_access_token(user: User) -> str:
    now = datetime.now(timezone.utc)

    payload = {
        "sub": str(user.id),
        "role": user.role,
        "iat": now,
        "exp": now + timedelta(minutes=30),
    }

    return jwt.encode(
        payload,
        _secret_key(),
        algorithm=JWT_ALGORITHM,
    )


def _get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(
            credentials.credentials,
            _secret_key(),
            algorithms=[JWT_ALGORITHM],
        )
        user_id = int(payload.get("sub", ""))
    except (jwt.InvalidTokenError, ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    return user


def _generate_otp() -> str:
    return f"{secrets.randbelow(900000) + 100000:06d}"


def _normalise_email(email: str) -> str:
    return email.strip().lower()


def _utc(value: datetime) -> datetime:
    # Handle naive timestamps defensively.
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def _send_new_otp(user: User, db: Session) -> None:
    otp = _generate_otp()
    now = datetime.now(timezone.utc)

    user.otp_hash = _hash_otp(otp)
    user.otp_expires_at = now + timedelta(minutes=OTP_EXPIRY_MINUTES)
    user.otp_attempts = 0
    user.otp_last_sent_at = now

    db.commit()

    try:
        send_otp_email(user.email, otp)
    except Exception:
        # Keep the account pending, but allow an immediate retry.
        user.otp_hash = None
        user.otp_expires_at = None
        user.otp_last_sent_at = None
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "We couldn't send the verification email. "
                "Check the Gmail SMTP settings and try again."
            ),
        )


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    payload: UserRegister,
    db: Session = Depends(get_db),
):
    email = _normalise_email(str(payload.email))

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    # Public registration is limited to student/faculty by UserRegister.
    role = payload.role

    user = User(
        full_name=payload.full_name.strip(),
        email=email,
        hashed_password=password_hash.hash(payload.password),
        role=role,
        is_active=True,
        is_email_verified=False,
        is_approved=(role == "student"),
        otp_attempts=0,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    _send_new_otp(user, db)

    return user


@router.post("/verify-otp", response_model=UserResponse)
def verify_otp(
    payload: VerifyOTP,
    db: Session = Depends(get_db),
):
    email = _normalise_email(str(payload.email))
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )

    if user.is_email_verified:
        return user

    if not user.otp_hash or not user.otp_expires_at:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active verification code. Request a new code.",
        )

    if user.otp_attempts >= OTP_MAX_ATTEMPTS:
        user.otp_hash = None
        user.otp_expires_at = None
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many incorrect attempts. Request a new code.",
        )

    if datetime.now(timezone.utc) >= _utc(user.otp_expires_at):
        user.otp_hash = None
        user.otp_expires_at = None
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code expired. Request a new code.",
        )

    if not hmac.compare_digest(
        user.otp_hash,
        _hash_otp(payload.otp),
    ):
        user.otp_attempts += 1
        db.commit()

        remaining = max(OTP_MAX_ATTEMPTS - user.otp_attempts, 0)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Incorrect verification code. "
                f"Attempts remaining: {remaining}"
            ),
        )

    user.is_email_verified = True
    user.otp_hash = None
    user.otp_expires_at = None
    user.otp_attempts = 0

    db.commit()
    db.refresh(user)

    return user


@router.post("/resend-otp")
def resend_otp(
    payload: ResendOTP,
    db: Session = Depends(get_db),
):
    email = _normalise_email(str(payload.email))
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )

    if user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is already verified. Please log in.",
        )

    if user.otp_last_sent_at:
        elapsed = (
            datetime.now(timezone.utc) - _utc(user.otp_last_sent_at)
        ).total_seconds()

        if elapsed < OTP_RESEND_COOLDOWN_SECONDS:
            wait = max(
                1,
                int(OTP_RESEND_COOLDOWN_SECONDS - elapsed),
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    f"Please wait {wait} seconds before "
                    "requesting another code."
                ),
            )

    _send_new_otp(user, db)

    return {
        "message": "A new verification code has been sent to your email."
    }


@router.post("/login", response_model=TokenResponse)
def login(
    payload: UserLogin,
    db: Session = Depends(get_db),
):
    email = _normalise_email(str(payload.email))
    user = db.query(User).filter(User.email == email).first()

    if not user or not password_hash.verify(
        payload.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account is inactive",
        )

    if not user.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in.",
        )

    if user.role == "faculty" and not user.is_approved:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your faculty account is awaiting admin approval.",
        )

    return TokenResponse(
        access_token=_create_access_token(user),
        token_type="bearer",
        user=user,
    )


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(_get_current_user),
):
    return current_user


@router.get("/pending-faculty", response_model=list[UserResponse])
def get_pending_faculty(
    db: Session = Depends(get_db),
    current_user: User = Depends(_get_current_user),
):
    # Only an authenticated admin can view pending faculty accounts.
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can view pending faculty accounts.",
        )

    return (
        db.query(User)
        .filter(
            User.role == "faculty",
            User.is_email_verified.is_(True),
            User.is_approved.is_(False),
        )
        .order_by(User.created_at.asc())
        .all()
    )


@router.post("/approve-faculty/{user_id}", response_model=UserResponse)
def approve_faculty(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(_get_current_user),
):
    # Only an authenticated admin can approve faculty accounts.
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only an admin can approve faculty accounts",
        )

    faculty = db.query(User).filter(User.id == user_id).first()

    if not faculty or faculty.role != "faculty":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Faculty account not found",
        )

    if not faculty.is_email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The faculty member must verify their email first",
        )

    faculty.is_approved = True
    db.commit()
    db.refresh(faculty)

    return faculty
