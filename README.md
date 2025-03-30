<div align="center">

  <h2>ClassLog |  클래스로그</h2>
  
  <h3>강의를 더 스마트하게, 학습을 더 효과적으로 📚 </h3>
  <b>2025.03.19 ~ 개발중✨</b>

</div>

<br />

## 💁🏻 기획 의도

현대 교육 환경에서는 강사와 학생 간의 원활한 소통과 체계적인 학습 관리가 필수적입니다. 하지만 기존의 온라인 강의 시스템은 강사의 강의 운영 효율성과 학생의 학습 몰입도를 높이는 데 한계가 있습니다. 이에 따라 강사와 학생을 위한 맞춤형 온라인 강의 관리 및 학습 지원 시스템을 기획하게 되었습니다.

이 시스템은 강사의 강의 운영 최적화와 학생의 학습 효과 극대화를 목표로 하며, 다음과 같은 핵심 기능을 제공합니다:

> 1️⃣ **강사 중심 기능**: 강의 준비, 교안 및 퀴즈 업로드, 실시간 강의 녹음 및 강의자료 위 필기 기능, 퀴즈 자동 생성, 학생 이해도 분석 및 피드백 관리  
 2️⃣ **학생 중심 기능**: 강의 자료 다운로드, 실시간 강의 참여, 퀴즈 및 복습 기능, 개별 피드백 확인 및 설문 제출

특히, 강사는 학생들의 퀴즈 결과, 질문, 피드백 데이터를 시각적으로 확인하여 강의 운영에 반영할 수 있으며, 학생들은 개별 맞춤 학습 경험을 통해 보다 체계적인 학습을 진행할 수 있습니다.

본 시스템을 통해 강사는 강의의 질을 높이고, 학생들은 능동적으로 학습할 수 있는 환경을 조성하고자 합니다. 데이터 기반 학습 분석을 통한 맞춤형 강의 제공, 이를 통해 강사와 학생 모두가 만족하는 교육 플랫폼을 실현하는 것이 본 기획의 궁극적인 목표입니다. 🚀

<br />

## 💻 기술 스택

| Back-End | Front-End | 배포 | 협업 툴 |
|----------|-----------|------|----------|
| <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> <br> <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white">  <img src="https://img.shields.io/badge/Amazon S3-569A31?style=for-the-badge&logo=amazonaws&logoColor=white"> | <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white">  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <br> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/Zustand-5A31F4?style=for-the-badge&logo=zustand&logoColor=white"> <br> <img src="https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white">  <img src="https://img.shields.io/badge/PWA-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white"> | <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white"> | <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"> <br> <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"> |



<br>

## 🛠️ 설치 및 실행 가이드
### 🔧 BE (Spring Boot - Java)

1. Java 설치 (최초 1회만)
```bash
brew install openjdk@17

sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

touch ~/.zshrc
echo 'export JAVA_HOME="/opt/homebrew/opt/openjdk@17"' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

java -version  # Java 17 설치 확인
```
2. 서버 빌드 및 실행
```bash
cd backend              # 백엔드 폴더로 이동
chmod +x ./gradlew      # 실행 권한 부여
./gradlew build         # 프로젝트 빌드

cd build/libs
ls -arlth               # JAR 파일 이름 확인
java -jar [JAR 파일명]  # 예: java -jar backend-0.0.1-SNAPSHOT.jar
```

### 💻 FE (Next.js + TypeScript)
1. 프론트엔드 폴더로 이동
   ```bash
   cd frontend
   ```
2. 의존성 및 라이브러리 설치
    ```bash
    npm install
    ```
3. 실행
   ```bash
   npm run dev
   ```
   

## 🎥 시연 영상

<br />

## 💝 팀원 소개

| 항목   | [김수민](https://github.com/sunninz)      | [김해민](https://github.com/mumminn)      | [손아현](https://github.com/iinuyha)      | [주세원](https://github.com/wntpdnjs)      |
| ------ | ----------------------------------------- | ----------------------------------------- | ----------------------------------------- | ------------------------------------------ |
| 이미지 | ![김수민](https://github.com/sunninz.png) | ![김해민](https://github.com/mumminn.png) | ![손아현](https://github.com/iinuyha.png) | ![주세원](https://github.com/wntpdnjs.png) |
| 역할   |                                           |                                           |                                           |                                            |

<br>

## 👷 버전 기록

| 버전 | <div align="center">업데이트 내용</div> | 업데이트 날짜 |
| :--: | :-------------------------------------- | :-----------: |
