# JVM VISION Deployment Guide

## 1. Overview & Architecture

JVM VISION is designed for versatile deployment options ranging from a local all-in-one standalone executable to a production multi-cloud architecture:

```text
                    INTERNET
                       │
              ┌────────▼────────┐
              │     Vercel      │
              │  React Frontend │
              └────────┬────────┘
                       │ HTTPS / REST
              ┌────────▼────────┐
              │     Render      │
              │ Spring Boot API │
              └────────┬────────┘
                       │ JDBC (TLS)
              ┌────────▼────────┐
              │    Supabase     │
              │   PostgreSQL    │
              └─────────────────┘
```

---

## 2. Option A: Single Runnable Standalone JAR (Recommended for Local/Viva/VMs)

The project includes an embedded build workflow where the compiled React production assets are bundled directly into the Spring Boot JAR under `src/main/resources/static/`.

### 2.1 Build Command
```bash
# Windows
scripts\build.bat

# Linux / macOS
mvn clean package -DskipTests
```

This generates:
`backend/target/jvm-vision.jar` (also copied to `jvm-vision.jar` in the root).

### 2.2 Run Command
```bash
java -jar jvm-vision.jar
```
By default, the server starts on `http://localhost:8080/`, serving both the frontend SPA and the REST API using an embedded PostgreSQL-compatible H2 database stored at `./data/jvmvision`.

---

## 3. Option B: Cloud Production Deployment

### 3.1 Database: Supabase PostgreSQL
1. Create a new PostgreSQL project on [Supabase](https://supabase.com).
2. Retrieve the JDBC Connection String from **Project Settings → Database → Connection Pooling / Direct Connection**:
   ```text
   jdbc:postgresql://<db-host>.supabase.co:5432/postgres?sslmode=require
   ```
3. The database tables (`execution_sessions`, `execution_events`, `examples`) are automatically initialized via `backend/src/main/resources/schema.sql` on startup.

---

### 3.2 Backend: Render Web Service
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your Git repository.
3. Configure the build and start settings:
   - **Environment**: `Docker` or `Java`
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `java -Dserver.port=$PORT -jar backend/target/jvm-vision.jar`
4. Set Environment Variables:
   ```env
   PORT=8080
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:postgresql://<db-host>.supabase.co:5432/postgres?sslmode=require
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your-supabase-db-password
   CORS_ALLOWED_ORIGIN=https://jvm-vision.vercel.app
   ```

---

### 3.3 Frontend: Vercel Web Deployment
1. Create a new project on [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Configure Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Configure Environment Variables:
   ```env
   VITE_API_BASE_URL=https://jvm-vision-api.onrender.com
   ```
5. Deploy. The React visualizer will now communicate with the Render Spring Boot backend over HTTPS.

---

## 4. Environment Variables Reference

| Variable Name | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Web server HTTP port |
| `SPRING_PROFILES_ACTIVE` | `dev` | Profile (`dev` uses file H2; `prod` uses PostgreSQL) |
| `DATABASE_URL` | `jdbc:h2:file:./data/jvmvision;...` | JDBC database connection URL |
| `DATABASE_USERNAME` | `sa` | Database authentication username |
| `DATABASE_PASSWORD` | `""` | Database authentication password |
| `CORS_ALLOWED_ORIGIN` | `http://localhost:5173` | Allowed frontend origin for CORS headers |
