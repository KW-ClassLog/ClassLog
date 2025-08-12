FROM node:18
WORKDIR /app

# package.json과 package-lock.json을 먼저 복사
COPY package*.json ./

# 의존성 설치 시 캐시 정리
RUN npm cache clean --force
RUN npm install --force

# 소스 코드 복사
COPY . .

# 빌드 전 캐시 정리 및 빌드
RUN npm run build
RUN npm install -g serve

# serve.json을 dist 안으로
COPY serve.json ./dist/serve.json

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]