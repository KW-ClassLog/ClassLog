package org.example.backend.domain.lectureNote.converter;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

@Component
public class LibreOfficeConverter {

    // pptx -> pdf 변환
    public File convertPptxToPdf(File pptxFile) throws IOException {
        try {
            String outputDir = pptxFile.getParent();

            String baseName = pptxFile.getName().replaceAll("(?i)\\.pptx$", "");
            File outputPdf = new File(outputDir, baseName + ".pdf");

            ProcessBuilder pb = new ProcessBuilder(
                    "libreoffice", "--headless",
                    "--convert-to", "pdf:writer_pdf_Export",
                    pptxFile.getAbsolutePath(),
                    "--outdir", outputDir
            );
            Process process = pb.start();
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new IOException("LibreOffice 변환 실패: exitCode=" + exitCode);
            }

            if (!outputPdf.exists()) {
                throw new IOException("LibreOffice 변환 실패: 출력 PDF 없음");
            }

            return outputPdf;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("LibreOffice 변환 중 인터럽트 발생", e);
        }
    }
}