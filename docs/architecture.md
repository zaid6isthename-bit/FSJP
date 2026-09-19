# MESHNOTE Architecture & System Design

## 1. Executive Summary

**MESHNOTE** is a decentralized, offline-first peer-to-peer academic knowledge network designed for college campus environments. It enables students on the same local network (Wi-Fi router or smartphone mobile hotspot) to automatically discover each other, search and index study material, and directly transfer files between laptops without relying on any external cloud infrastructure.

---

## 2. Core Architectural Principles

1. **Browser Isolation**:
   Web browsers cannot directly open raw UDP or TCP sockets for security reasons. The React frontend interacts solely with the local Spring Boot application via standard HTTP REST APIs (`http://localhost:8080/api/*`).
2. **Local Hybrid Node**:
   Each participating student laptop runs an identical standalone application that acts simultaneously as:
   - **Frontend client** (React SPA)
   - **Local application server** (Spring Boot 3.x)
   - **Database client** (Spring JDBC with H2 file persistence)
   - **Peer discovery agent** (Java `DatagramSocket` on UDP port `47777`)
   - **File transfer server & client** (Java `ServerSocket` / `Socket` on TCP port `49000`)
3. **Zero Cloud Dependency**:
   All communication occurs over private LAN IPv4 broadcast and direct peer-to-peer socket streams. No external API keys, cloud databases, or internet access are required.

---

## 3. High-Level System Diagram

```text
                  +-----------------------------------+
                  |      React Frontend (Stitch)      |
                  |  Overview · Discover · Transfers  |
                  +-----------------+-----------------+
                                    |
                           HTTP REST (/api/*)
                                    |
                  +-----------------v-----------------+
                  |    Spring Boot Local Java Node    |
                  |     Port 8080 (Embedded Tomcat)   |
                  +--------+------------------+-------+
                           |                  |
               Spring JDBC |                  | P2P Engine
                           |                  |
                  +--------v-------+     +----v--------------------+
                  |  H2 Database   |     |    Java Networking      |
                  | data/database/ |     |                         |
                  +----------------+     | UDP Port: 47777 (Peers) |
                                         | TCP Port: 49000 (Files) |
                                         +----+---------------+----+
                                              |               |
                                              | UDP HELLO     | TCP Stream
                                              |               |
                                         +----v---------------+----+
                                         |   Remote Classmate      |
                                         |   (Node B on LAN)       |
                                         +-------------------------+
```

---

## 4. Component Layering

### Presentation Layer (`frontend/`)
- Built with **React 18** and **Vite**.
- Styled with **Tailwind CSS** using the exact typography (`Inter`, `Material Symbols Outlined`), color system, and layout tokens from `design.md`.
- Uses a unified service abstraction in `src/services/` (`api.js`, `peerService.js`, `fileService.js`, `transferService.js`, `dashboardService.js`, `networkService.js`).
- Dynamic SVG & canvas topology graph visualizing real connected nodes, socket activity, and data packet animations.

### Controller Layer (`com.meshnote.controller`)
- Exposes clean, versioned REST endpoints returning uniform `ApiResponse<T>` envelopes.
- Global exception handling via `@RestControllerAdvice` mapping domain exceptions to standard HTTP error codes (`400 Bad Request`, `404 Not Found`, `500 Internal Error`).

### Service Layer (`com.meshnote.service`)
- Enforces academic file sharing business rules.
- Manages peer registry lifecycle and heartbeat timeouts.
- Coordinates asynchronous file downloads via a managed `ExecutorService` thread pool.

### Persistence Layer (`com.meshnote.repository`)
- Direct Spring `JdbcTemplate` implementation without Hibernate/JPA overhead.
- Raw parameterized SQL queries preventing SQL injection.
- Standalone DDL schemas: `schema-h2.sql` (default, file-backed) and `schema-mysql.sql`.

### Networking Layer (`com.meshnote.network`)
- **`UdpDiscoveryService`**: Uses `DatagramSocket` to broadcast and receive JSON `HELLO` beacons every 5 seconds.
- **`TcpP2pServer`**: Uses `ServerSocket` to accept incoming connections and stream files in 64 KB buffers.
- **`P2pClient`**: Connects to remote peer sockets to query file lists and stream downloaded binaries.
