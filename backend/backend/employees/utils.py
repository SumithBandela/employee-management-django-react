from django.core.mail import EmailMessage
from django.template.loader import render_to_string

def send_welcome_mail(name,to_mail,file_path):
    subject = 'Welcome to platform'
    html_message = render_to_string('emails/welcome_email.html',{'name':name})
    email = EmailMessage(subject,html_message,to=[to_mail])
    email.content_subtype = 'html'
    email.attach_file(file_path)
    email.send()
    