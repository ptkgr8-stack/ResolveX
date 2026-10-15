
import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()


def send_otp_email(recipient: str, otp: str) -> None:
    host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    port = int(os.getenv("SMTP_PORT", "587"))
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
    sender = os.getenv("SMTP_FROM_EMAIL", username)

    if not username or not password or not sender:
        raise RuntimeError(
            "Gmail SMTP settings are missing in backend/.env"
        )

    message = EmailMessage()
    message["Subject"] = "Your ResolveX verification code"
    message["From"] = sender
    message["To"] = recipient

    message.set_content(
        f"Your ResolveX verification code is {otp}.\n\n"
        "This code expires in 5 minutes. "
        "Do not share it with anyone."
    )

    with smtplib.SMTP(host, port, timeout=15) as server:
        server.starttls()
        server.login(username, password)
        server.send_message(message)
