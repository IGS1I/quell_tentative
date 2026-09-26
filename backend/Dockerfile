# syntax=docker/dockerfile:1

# dev stage
FROM eclipse-temurin:21-jdk AS dev
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
RUN chmod +x gradlew
RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew dependencies --no-daemon -q
COPY src src
ENTRYPOINT ["./gradlew", "bootRun", "--no-daemon"]

# build stage
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
RUN chmod +x gradlew
RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew dependencies --no-daemon -q
COPY src src
RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew build -x test --no-daemon

# prod
FROM eclipse-temurin:21-jre AS prod
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
