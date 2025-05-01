package org.example.backend.domain.classroom.service;

import org.example.backend.domain.classroom.converter.ClassroomConverter;
import org.example.backend.domain.classroom.dto.request.ClassroomRequestDTO;
import org.example.backend.domain.classroom.entity.Classroom;
import org.example.backend.domain.classroom.exception.ClassroomErrorCode;
import org.example.backend.domain.classroom.exception.ClassroomException;
import org.example.backend.domain.classroom.repository.ClassroomRepository;
import org.example.backend.domain.lectureNote.entity.LectureNote;
import org.example.backend.domain.lectureNote.repository.LectureNoteRepository;
import org.example.backend.global.S3.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class ClassroomServiceImpl implements ClassroomService {

    private ClassroomRepository classroomRepository;
    private ClassroomConverter classroomConverter;
    private LectureNoteRepository lectureNoteRepository;
    private S3Service s3Service;

    //의존성 주입
    @Autowired
    public ClassroomServiceImpl(ClassroomConverter classroomConverter, ClassroomRepository classroomRepository, LectureNoteRepository lectureNoteRepository, S3Service s3Service) {
        this.classroomConverter = classroomConverter;
        this.classroomRepository = classroomRepository;
        this.lectureNoteRepository = lectureNoteRepository;
        this.s3Service = s3Service;
    }

    // Classroom 생성
    public Classroom createClassroom(ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomConverter.toEntity(classroomRequestDTO);

        return classroomRepository.save(classroom);
    }
    // Classroom 조회
    public Classroom getClassroom(UUID classId) {
        return classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND)); // 예외 처리
    }

    @Transactional
    // Classroom 삭제
    public void deleteClassroom(UUID classId) {
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));

        // 2. 관련 LectureNote 삭제
        List<LectureNote> notes = lectureNoteRepository.findByClassroom_Id(classId);

        // 3. S3에서 파일 삭제
        for (LectureNote note : notes) {
            // noteUrl 필드에서 S3 Key 추출 후 삭제
            String s3Key = note.getNoteUrl();  // noteUrl 필드에 S3 key가 저장되어 있다고 가정
            s3Service.deleteFile(s3Key);  // S3 파일 삭제
        }

        // 4. DB에서 LectureNote 삭제
        lectureNoteRepository.deleteAll(notes);

        classroomRepository.delete(classroom);
    }

    // Classroom 수정
    public Classroom updateClassroom(UUID classId, ClassroomRequestDTO classroomRequestDTO) {
        Classroom classroom = classroomRepository.findById(classId)
                .orElseThrow(() -> new ClassroomException(ClassroomErrorCode.CLASS_NOT_FOUND));
        if (classroomRequestDTO.getClassName() != null) {
            classroom.setClassName(classroomRequestDTO.getClassName());
        }
        if (classroomRequestDTO.getClassDate() != null) {
            classroom.setClassDate(classroomRequestDTO.getClassDate());
        }
        if (classroomRequestDTO.getStartDate() != null) {
            classroom.setStartDate(classroomRequestDTO.getStartDate());
        }
        if (classroomRequestDTO.getEndDate() != null) {
            classroom.setEndDate(classroomRequestDTO.getEndDate());
        }

        return classroomRepository.save(classroom);
    }
}
