# Multi-stage build for JVM VISION (All-in-One Full-Stack)
# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend Spring Boot JAR
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /app
COPY backend/pom.xml backend/
COPY backend/src backend/src
# Copy compiled frontend assets into Spring Boot static resources
COPY --from=frontend-builder /app/frontend/dist backend/src/main/resources/static
RUN mvn -f backend/pom.xml clean package -DskipTests

# Stage 3: Minimal production runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/target/jvm-vision.jar app.jar
RUN mkdir -p /app/data
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
