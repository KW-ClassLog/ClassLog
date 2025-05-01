package org.example.backend.global.S3.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final AmazonS3 amazonS3Client;

    @Value("${AWS_S3_BUCKET_NAME}")
    private String bucket;

    /**
     * 파일 업로드
     */
    public String uploadFile(MultipartFile file, String key) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());
        metadata.setContentType(file.getContentType());

        amazonS3Client.putObject(new PutObjectRequest(bucket, key, file.getInputStream(), metadata)
                .withCannedAcl(CannedAccessControlList.Private)); // 필요 시 public 설정도 가능

        return key; // 또는 amazonS3Client.getUrl(bucket, key).toString()
    }

    /**
     * 파일 삭제
     */
    public void deleteFile(String key) {
        if (doesObjectExist(key)) {
            amazonS3Client.deleteObject(bucket, key);
            log.info("Deleted file from S3: {}", key);
        } else {
            log.warn("Attempted to delete non-existing file: {}", key);
        }
    }

    /**
     * Presigned URL 발급 (다운로드용)
     */
    public String getPresignedUrl(String key) {
        Date expiration = new Date(System.currentTimeMillis() + 1000 * 60 * 60); // 1시간

        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucket, key)
                .withMethod(HttpMethod.GET)
                .withExpiration(expiration);

        URL url = amazonS3Client.generatePresignedUrl(request);
        return url.toString();
    }

    /**
     * 객체 존재 확인
     */
    private boolean doesObjectExist(String key) {
        return amazonS3Client.doesObjectExist(bucket, key);
    }
}
