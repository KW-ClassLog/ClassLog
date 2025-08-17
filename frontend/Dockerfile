# node:18-alpine을 베이스로 사용합니다.
FROM node:18-alpine AS base

# 베이스는 node:18-alpine을 그대로 사용하고, deps라는 이름으로 복사합니다.
FROM base AS deps

# libc6-compat을 설치
RUN apk add --no-cache libc6-compat

# /app 경로로 이동합니다.
WORKDIR /app

# 의존성 복사
COPY package.json package-lock.json ./

# 의존성 설치
RUN npm install --frozen-lockfile

# 나머지 파일 복사
COPY . .

# Next.js 애플리케이션 빌드
RUN npm run build

# 애플리케이션 실행
CMD ["npm", "start"]

# 3000번 포트 노출
EXPOSE 3000