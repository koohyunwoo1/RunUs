
de.js 20.15.0을 사용합니다.
FROM node:20.15.0

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# package.json과 package-lock.json을 작업 디렉토리로 복사합니다.
COPY package*.json ./

# 의존성을 설치합니다.
RUN npm install

# 모든 파일을 작업 디렉토리로 복사합니다.
COPY . .

# 컨테이너가 실행될 때 'npm start' 명령어를 실행하도록 설정합니다.
CMD ["npm", "start"]

# 애플리케이션이 3000 포트에서 실행된다고 가정하고, 해당 포트를 열어줍니다.
EXPOSE 3000
