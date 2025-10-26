FROM eclipse-temurin:17-jdk

RUN apt-get update \
    && apt-get install -y --no-install-recommends libreoffice \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY build/libs/backend-0.0.1-SNAPSHOT.jar /app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app.jar"]