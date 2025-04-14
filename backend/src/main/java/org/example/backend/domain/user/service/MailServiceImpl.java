package org.example.backend.domain.user.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService{

    @Value("${spring.mail.username")
    private String senderEmail;

    private final JavaMailSender mailSender;

    // 인증 코드 생성 및 이메일 전송
    @Override
    public int sendVerificationCode(String email) {

        int authCode = ThreadLocalRandom.current().nextInt(100000, 1000000);

        try{
            MimeMessage emailForm = createEmailForm(email,authCode);
            mailSender.send(emailForm);
        } catch (MessagingException | MailSendException e){
            throw new UserException(UserErrorCode._EMAIL_SEND_FAILURE);
        }

        return authCode;
    }

    // 메시지 생성
    private MimeMessage createEmailForm(String email,int authCode) throws MessagingException{

        MimeMessage message = mailSender.createMimeMessage();
        message.setFrom(senderEmail);
        message.setRecipients(MimeMessage.RecipientType.TO,email);
        message.setSubject("ClassLog 인증코드");
        message.setText(setContext(String.valueOf(authCode)),"utf-8","html");

        return message;
    }

    // 본문 생성
    private String setContext(String authCode){
        String body = "";
        body += "<h4>" + "인증번호를 입력하세요." +"</h4>";
        body += "<h2>" + "[" + authCode +"]" + "</h2>";

        return body;
    }


}
