
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    # Roles: student, faculty, admin, technician
    role = Column(String(20), nullable=False, default="student")
    is_active = Column(Boolean, nullable=False, default=True)

    # Email verification and faculty approval
    is_email_verified = Column(Boolean, nullable=False, default=False)
    is_approved = Column(Boolean, nullable=False, default=True)

    # Temporary OTP data
    otp_hash = Column(String(64), nullable=True)
    otp_expires_at = Column(DateTime(timezone=True), nullable=True)
    otp_attempts = Column(Integer, nullable=False, default=0)
    otp_last_sent_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
