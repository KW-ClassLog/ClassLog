package org.example.backend.domain.user.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.example.backend.global.code.BaseErrorCode;
import org.example.backend.global.code.ErrorReasonDTO;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum UserErrorCode implements BaseErrorCode {

    _EMAIL_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "SIGNUP400_1", "이미 사용 중인 이메일입니다."),
    _TOKEN_MISSING(HttpStatus.UNAUTHORIZED, "AUTH401_1", "토큰이 존재하지 않습니다."),
    _TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED,"AUTH401_2","토큰이 만료되었습니다."),
    _REFRESH_TOKEN_MISSING(HttpStatus.UNAUTHORIZED, "AUTH401_3", "리프레시 토큰이 존재하지 않습니다."),
    _REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED,"AUTH401_4","리프레시 토큰이 만료되었습니다. 다시 로그인해주세요."),
    _TOKEN_BLACKLISTED(HttpStatus.UNAUTHORIZED,"AUTH401_5","로그아웃된 토큰입니다."),
    _EMAIL_SEND_FAILURE(HttpStatus.INTERNAL_SERVER_ERROR,"SIGNUP500","메일 전송 중 오류가 발생하였습니다."),
    _EMAIL_NOT_FOUND(HttpStatus.NOT_FOUND,"USER404","존재하지 않는 이메일입니다."),
    _INVALID_PASSWORD(HttpStatus.BAD_REQUEST,"USER400","비밀번호가 일치하지 않습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    @Override
    public ErrorReasonDTO getReasonHttpStatus() {
        return ErrorReasonDTO.builder()
                .httpStatus(this.httpStatus)
                .isSuccess(false)
                .code(this.code)
                .message(this.message)
                .build();
    }
}
