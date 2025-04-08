package org.example.backend.global;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.example.backend.global.code.BaseCode;
import org.example.backend.global.code.ReasonDTO;
import org.example.backend.global.code.base.FailureCode;
import org.example.backend.global.code.base.SuccessCode;

@Getter
@Builder
@AllArgsConstructor
@JsonPropertyOrder({"isSuccess", "code", "message", "result"})
public class ApiResponse<T> {
    @JsonProperty("isSuccess")
    private final Boolean isSuccess;
    private final String code;
    private final String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T result;


    public static <T> ApiResponse<T> onSuccess(T result) {
        ReasonDTO dto = SuccessCode._OK.getReasonHttpStatus();
        return new ApiResponse<>(true, dto.getCode(), dto.getMessage(), result);
    }

    public static <T> ApiResponse<T> of(BaseCode code, T result) {
        return new ApiResponse<>(true, code.getReasonHttpStatus().getCode(), code.getReasonHttpStatus().getMessage(),
                result);
    }

    public static <T> ApiResponse<T> onFailure(String code, String message, T data) {
        return new ApiResponse<>(false, code, message, data);
    }

    public static <T> ApiResponse<T> onFailure(FailureCode errorReason) {
        return ApiResponse.<T>builder()
                .isSuccess(false)
                .code(errorReason.getReasonHttpStatus().getCode())
                .message(errorReason.getReasonHttpStatus().getMessage())
                .build();
    }

}