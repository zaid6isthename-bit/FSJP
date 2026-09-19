# MESHNOTE Database & Persistence Guide

This document details the database architecture, schema definitions, and design decisions for MESHNOTE.

---

## 1. Architectural Decision: Spring JDBC vs. Hibernate/JPA

For this semester project, MESHNOTE explicitly uses **Spring JDBC (`JdbcTemplate`)** instead of Hibernate/JPA:

1. **Academic Transparency (Viva Credibility)**:
   Every query is explicit, readable SQL. During an oral examination (viva), you can explain the exact `INSERT`, `UPDATE`, `SELECT`, and `JOIN` statements without having to explain Hibernate session proxies, lazy loading anomalies, or second-level caches.
2. **Zero Overhead**:
   MESHNOTE runs on local student laptops alongside the frontend and peer sockets. Spring JDBC has virtually zero memory overhead and starts in under 2 seconds.
3. **No Hidden Magic**:
   Entity updates happen when explicit DAO/Repository methods are invoked, preventing dirty-checking issues or unintended database locks during high-throughput file transfers.

---

## 2. Supported Databases & Dual Schema Strategy

MESHNOTE maintains two separate, verified DDL scripts in `src/main/resources/`:

- **`schema-h2.sql` (Default)**: Optimized for local zero-configuration file persistence using H2 Database Engine 2.2+.
- **`schema-mysql.sql` (Optional)**: Formatted with standard MySQL dialect for enterprise or multi-user lab deployment.

### Default H2 Connection Configuration
Defined in `application.properties`:
```properties
spring.datasource.url=jdbc:h2:file:./data/database/meshnotedb;AUTO_SERVER=TRUE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema-h2.sql
```

> **Note**: `AUTO_SERVER=TRUE` enables concurrent process access so external tools (such as H2 Console or DBeaver) can inspect the database while MESHNOTE is running.

---

## 3. Entity-Relationship Schema

### Table: `users`
Stores the local student's profile information.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | Internal user ID |
| `peer_id` | `VARCHAR(64)` | `NOT NULL UNIQUE` | Ephemeral or persistent peer UUID |
| `display_name` | `VARCHAR(100)` | `NOT NULL` | Name visible to peers |
| `avatar_url` | `VARCHAR(255)` | `DEFAULT ''` | Profile picture URL |
| `college_name` | `VARCHAR(150)` | `DEFAULT ''` | University / College |
| `department` | `VARCHAR(100)` | `DEFAULT ''` | Engineering branch |
| `semester` | `VARCHAR(50)` | `DEFAULT ''` | Current study semester |
| `bio` | `VARCHAR(500)` | `DEFAULT ''` | Short bio or status |
| `is_discoverable`| `BOOLEAN` | `DEFAULT TRUE` | Whether UDP broadcasting is enabled |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Initial setup time |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Last profile update |

---

### Table: `shared_files`
Catalog of documents explicitly shared by this node.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | Local file record ID |
| `file_id` | `VARCHAR(64)` | `NOT NULL UNIQUE` | Unique identifier shared across network |
| `file_name` | `VARCHAR(255)` | `NOT NULL` | Original filename with extension |
| `file_path` | `VARCHAR(500)` | `NOT NULL` | Absolute or relative disk path |
| `file_size` | `BIGINT` | `NOT NULL` | Size in bytes |
| `course_code` | `VARCHAR(50)` | `DEFAULT ''` | E.g. CS301, MAT201 |
| `course_name` | `VARCHAR(150)` | `DEFAULT ''` | Full subject name |
| `category` | `VARCHAR(50)` | `NOT NULL` | NOTES, PAST_PAPERS, etc. |
| `description` | `VARCHAR(1000)`| `DEFAULT ''` | Document overview |
| `tags` | `VARCHAR(255)` | `DEFAULT ''` | Comma-separated search tags |
| `access_count` | `INTEGER` | `DEFAULT 0` | Download count by classmates |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Time indexed |

---

### Table: `transfers`
Audit and state tracking for all incoming and outgoing file transfers.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | Transfer job ID |
| `file_id` | `VARCHAR(64)` | `NOT NULL` | File being transferred |
| `file_name` | `VARCHAR(255)` | `NOT NULL` | Display name of the file |
| `peer_id` | `VARCHAR(64)` | `NOT NULL` | Remote peer identifier |
| `peer_name` | `VARCHAR(100)` | `NOT NULL` | Remote peer display name |
| `direction` | `VARCHAR(20)` | `NOT NULL` | `DOWNLOAD` or `UPLOAD` |
| `transferred_bytes`| `BIGINT` | `DEFAULT 0` | Bytes streamed so far |
| `total_bytes` | `BIGINT` | `NOT NULL` | Expected size in bytes |
| `status` | `VARCHAR(20)` | `NOT NULL` | `QUEUED`, `DOWNLOADING`, `COMPLETED`, `FAILED` |
| `speed_bytes_sec` | `BIGINT` | `DEFAULT 0` | Current transfer rate |
| `error_message` | `VARCHAR(500)` | `DEFAULT NULL` | Cause if transfer failed |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Start time |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Last progress tick |

---

### Table: `notifications`
In-app alert items (peer joins, download completions).

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | Notification ID |
| `title` | `VARCHAR(150)` | `NOT NULL` | Short title |
| `message` | `VARCHAR(500)` | `NOT NULL` | Full alert text |
| `type` | `VARCHAR(50)` | `NOT NULL` | `INFO`, `SUCCESS`, `WARNING`, `ERROR` |
| `is_read` | `BOOLEAN` | `DEFAULT FALSE` | Has user dismissed it |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Event timestamp |

---

### Table: `activity_log`
Chronological network event log powering the Network Activity dashboard and topology graph.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | Event ID |
| `event_type` | `VARCHAR(50)` | `NOT NULL` | `PEER_DISCOVERED`, `FILE_SHARED`, etc. |
| `description` | `VARCHAR(500)` | `NOT NULL` | Human-readable explanation |
| `peer_id` | `VARCHAR(64)` | `DEFAULT NULL` | Associated peer if applicable |
| `file_id` | `VARCHAR(64)` | `DEFAULT NULL` | Associated file if applicable |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Log timestamp |

---

## 4. Repository Implementation Patterns

Every repository implements parameter binding to guarantee **SQL injection prevention**:

```java
// Example from JdbcSharedFileRepository.java
String sql = "INSERT INTO shared_files (file_id, file_name, file_path, file_size, " +
             "course_code, course_name, category, description, tags, access_count, created_at) " +
             "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

jdbcTemplate.update(sql,
    file.getFileId(),
    file.getFileName(),
    file.getFilePath(),
    file.getFileSize(),
    file.getCourseCode(),
    file.getCourseName(),
    file.getCategory().name(),
    file.getDescription(),
    file.getTags(),
    0,
    Timestamp.valueOf(LocalDateTime.now())
);
```
