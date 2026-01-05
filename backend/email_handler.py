import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication


def send_email(to_address, subject, body, cv_path, cover_letter_path):
    from_address = "your_email@example.com"
    password = "your_password"

    msg = MIMEMultipart()
    msg["From"] = from_address
    msg["To"] = to_address
    msg["Subject"] = subject

    msg.attach(MIMEText(body, "plain"))

    with open(cv_path, "rb") as attachment:
        part = MIMEApplication(attachment.read(), Name="cv.pdf")
        part["Content-Disposition"] = 'attachment; filename="cv.pdf"'
        msg.attach(part)

    with open(cover_letter_path, "rb") as attachment:
        part = MIMEApplication(attachment.read(), Name="cover_letter.pdf")
        part["Content-Disposition"] = 'attachment; filename="cover_letter.pdf"'
        msg.attach(part)

    with smtplib.SMTP("smtp.example.com", 587) as server:
        server.starttls()
        server.login(from_address, password)
        server.send_message(msg)


# Example usage
# send_email('recipient@example.com', 'Subject', 'Email body', 'path_to_cv.pdf', 'path_to_cover_letter.pdf')
