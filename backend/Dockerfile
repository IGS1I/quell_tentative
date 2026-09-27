# syntax=docker/dockerfile:1

# JDK Stage
FROM debian:trixie-slim AS jdk
RUN apt-get update && apt-get install -y --no-install- recommends \
    openjdk-21-jdk-headless \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# dev stage
FROM jdk AS dev
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
FROM jdk AS build
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

# prod stage
FROM jdk AS prod
RUN apt-get update && apt-get install -y --no-install-recommends \
    openjdk-21-jre-headless \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
