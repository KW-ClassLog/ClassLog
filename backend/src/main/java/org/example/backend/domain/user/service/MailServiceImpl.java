package org.example.backend.domain.user.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.example.backend.domain.user.exception.UserErrorCode;
import org.example.backend.domain.user.exception.UserException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService{

    @Value("${spring.mail.username")
    private String senderEmail;

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    // 인증 코드 생성 & 이메일 인증 코드
    @Override
    public int sendVerificationCode(String email) {

        int authCode = ThreadLocalRandom.current().nextInt(100000, 1000000);

        try{
            MimeMessage emailForm = createEmailForm(email,authCode,
                    "[ClassLog] 이메일 인증을 위한 인증번호 안내 드립니다.","index");
            mailSender.send(emailForm);
        } catch (MessagingException | MailSendException e){
            throw new UserException(UserErrorCode._EMAIL_SEND_FAILURE);
        }

        return authCode;
    }

    @Override
    public int sendTemporaryPassword(String email) {
        int tempPassword = ThreadLocalRandom.current().nextInt(100000, 1000000);

        try{
            MimeMessage emailForm = createEmailForm(email, tempPassword,
                    "[ClassLog] 임시 비밀번호 안내 드립니다.","tempPassword");
            mailSender.send(emailForm);
        } catch (MessagingException | MailSendException e){
            throw new UserException(UserErrorCode._EMAIL_SEND_FAILURE);
        }

        return tempPassword;
    }

    // 메시지 생성
    private MimeMessage createEmailForm(String email,int authCode, String subject, String templateName) throws MessagingException{

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message,true,"UTF-8");

        message.setFrom(senderEmail);
        message.setRecipients(MimeMessage.RecipientType.TO,email);
        message.setSubject(subject);

        Context context = new Context();
        context.setVariable("authCode",authCode);

        String htmlContent = templateEngine.process(templateName,context);
        helper.setText(htmlContent,true);
        return message;
    }


}
