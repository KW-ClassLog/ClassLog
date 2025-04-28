package org.example.backend.global.S3.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final S3Client s3Client;

    @Value("${AWS_S3_BUCKET_NAME}")
    private String bucket;

    public String uploadFile(MultipartFile file, String key) throws IOException {
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(key)
                        .contentType(file.getContentType())
                        .build(),
                software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
        );

        return key; // 직접 URL 생성
    }

    /**
     * S3 파일 삭제
     * @param key 삭제할 S3 key
     */
    public void deleteFile(String key) {
        if (doesObjectExist(key)) {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build());
            log.info("Deleted file from S3: {}", key);
        } else {
            log.warn("Attempted to delete non-existing file: {}", key);
        }
    }

    /**
     * S3 객체 존재 여부 확인
     */
    private boolean doesObjectExist(String key) {
        try {
            s3Client.headObject(HeadObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 업로드된 파일 URL 생성
     */
    private String generateFileUrl(String key) {
        return String.format("https://%s.s3.amazonaws.com/%s", bucket, key);
    }
}