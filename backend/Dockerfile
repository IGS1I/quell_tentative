# TODO: this needs to actually build from the gradle ideally (gradle build)
FROM eclipse-temurin:17

ARG JAR_FILE=target/*.jar

COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java","-jar","/app.jar"]
