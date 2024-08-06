
#openJDK 17을 사용하여 베이스 이미지를 설정합니다.
FROM eclipse-temurin:17-jdk

# 필요한 파일들을 복사합니다.
COPY build.gradle settings.gradle gradlew /app/
COPY gradle /app/gradle
COPY src /app/src

# gradlew 파일에 실행 권한을 부여합니다.
RUN chmod +x /app/gradlew

# 프로젝트를 빌드합니다.
RUN /app/gradlew -p /app build --no-daemon

# 빌드된 파일을 나열하여 확인합니다.
RUN ls -al /app/build/libs

# 애플리케이션을 실행합니다.
ENTRYPOINT ["java","-jar","/app/build/libs/RunUs-0.0.1-SNAPSHOT.jar"]

# 네트워크 포트를 열어줍니다.
EXPOSE 8001
