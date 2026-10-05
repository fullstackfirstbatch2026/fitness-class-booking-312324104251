FROM eclipse-temurin:26-jdk

WORKDIR /app

COPY target/fitnessbooking-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8088

ENTRYPOINT ["java", "-jar", "app.jar"]