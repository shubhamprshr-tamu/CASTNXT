class UserMailer < ApplicationMailer
    default from:'fashionxtllc@gmail.com'
    def send_welcome(email)
      mail(to: email, subject: "Welcome", body:"<!DOCTYPE html><body><div>Aaya Karo ji Kadi Saddi Gali Bhul ke bhi....</div></body>", content_type: "text/html")
    end
end