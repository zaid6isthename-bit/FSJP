# MESHNOTE

### Offline Peer-to-Peer Academic Knowledge Network
> **"Your classroom, connected locally."**  
> *Share knowledge. Not bandwidth.*

![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Database](https://img.shields.io/badge/Database-Spring%20JDBC%20%2B%20H2-lightgrey.svg)
![P2P Protocol](https://img.shields.io/badge/Protocol-UDP%20%2B%20TCP%20Sockets-purple.svg)
![License](https://img.shields.io/badge/Academic-Semester%203%20Project-success.svg)

---

## 1. Overview

**MESHNOTE** is a decentralized, offline-first peer-to-peer academic document-sharing network engineered for college campus environments. It enables students on the same local network (Wi-Fi or smartphone mobile hotspot) to automatically discover each other, search academic material, and stream documents directly between laptops—**with zero internet, zero cloud servers, and zero third-party telemetry.**

---

## 2. Key Capabilities

- **Automatic Zero-Config Discovery**: Broadcasts lightweight UDP heartbeats on port `47777` to discover nearby classmate nodes within 5 seconds.
- **Direct High-Throughput Transfers**: Streams study material over raw TCP sockets on port `49000` in 64 KB memory-efficient buffers.
- **Academic Material Indexing**: Categorize files by Course Code (`CS301`), Category (`NOTES`, `PAST_PAPERS`, `ASSIGNMENTS`, `LAB_MANUALS`, `SLIDES`, `BOOKS`), and search tags.
- **Federated Local Search**: Search your library and aggregate catalogs from all online peers in real-time.
- **Asynchronous Non-blocking Transfers**: Instant UI response with a dedicated background thread pool managing transfer queues and progress telemetry.
- **Truthful UI Diagnostics**: Real network status, socket bindings, and peer presence tracking (`ONLINE`, `AWAY`, `OFFLINE`) with exact time-since-last-seen metrics.
- **All-in-One Standalone Executable**: Packaged into a single runnable `meshnote.jar` serving both the React frontend and Spring Boot REST backend on `http://localhost:8080`.

---

## 3. High-Level Architecture

```text
               +-----------------------------------+
               |        React Frontend (Stitch)    |
               |   Overview · Discover · Transfers |
               +-----------------+-----------------+
                                 |
                         HTTP REST (:8080/api/*)
                                 |
               +-----------------v-----------------+
               |    Spring Boot Local Java Node    |
               |       Embedded Tomcat Server      |
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
                                      |   (Laptop B on LAN)     |
                                      +-------------------------+
```

---

## 4. Quick Start (Run in 10 Seconds)

### Option A: Run the Prebuilt Executable
Double-click `run-meshnote.bat` or run:
```bash
java -jar meshnote.jar
```
Open **`http://localhost:8080`** in your browser.

### Option B: Build from Source
Compile both the React frontend and Spring Boot backend into a fresh JAR:
```cmd
build.bat
```

---

## 5. Live Two-Laptop Viva Demonstration

Demonstrating MESHNOTE in an oral examination takes less than 3 minutes:

1. **Connect to Same Hotspot**: Enable hotspot on any mobile phone (cellular data can be turned **OFF**). Connect Laptop A and Laptop B to the hotspot.
2. **Launch MESHNOTE**:
   - Run `java -jar meshnote.jar` on **Laptop A** (Alex Chen).
   - Run `java -jar meshnote.jar` on **Laptop B** (Maya Lin).
3. **Instant Peer Discovery**:
   - Within 5 seconds, Laptop A displays Laptop B in the **Nearby Peers** list and on the interactive **Network Topology Graph**.
4. **Share a Document**:
   - On Laptop A: Navigate to **My Library** -> Click **Share Academic File** -> Upload `OS_Lecture_Unit3.pdf`.
5. **Browse & Download**:
   - On Laptop B: Navigate to **Discover** or click on Laptop A in **Nearby Peers**.
   - Click **Download** on `OS_Lecture_Unit3.pdf`.
   - Watch the animated progress bar update in real-time as data streams over TCP port `49000`.
   - The file appears in Laptop B's `./data/downloads/` folder, and Laptop A's access counter increments.

---

## 6. Project Structure

```text
c:\Users\Zaid Mohammed\OneDrive\Documents\java\
├── backend/                  # Spring Boot 3 Java Application
│   ├── src/main/java/com/meshnote/
│   │   ├── controller/       # REST Endpoints (Profile, Peer, File, Transfer, Dashboard)
│   │   ├── dto/              # Request / Response Data Transfer Objects
│   │   ├── exception/        # Custom Domain Exceptions & @RestControllerAdvice
│   │   ├── model/            # Domain Entities & Enums
│   │   ├── network/          # UDP Discovery (47777) & TCP File Server/Client (49000)
│   │   ├── repository/       # Spring JdbcTemplate DAOs with Parameterized Queries
│   │   ├── service/          # Business Logic, Asynchronous Transfer Pool
│   │   └── util/             # PathSanitizer, NetworkUtils, HashUtils
│   └── src/main/resources/
│       ├── application.properties # H2 Config, Server Ports, Thread Pools
│       ├── schema-h2.sql     # Default embedded H2 DDL
│       └── schema-mysql.sql  # Optional production MySQL DDL
├── frontend/                 # React 18 SPA (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/       # Topbar, Sidebar, TopologyGraph, Modals
│   │   ├── pages/            # Overview, Discover, NearbyPeers, Transfers, Library
│   │   ├── services/         # Layered API abstraction (api.js, peerService, etc.)
│   │   └── index.css         # Stitch Design System tokens & utilities
├── data/                     # Persistent Local Node Storage
│   ├── database/             # H2 file-backed database (meshnotedb.mv.db)
│   ├── shared/               # Files shared by this node
│   └── downloads/            # Files downloaded from peers
├── docs/                     # Full Technical & Viva Documentation
│   ├── architecture.md       # Complete system architecture and component breakdown
│   ├── api.md                # Full REST API specification and JSON envelopes
│   ├── p2p-protocol.md       # UDP 47777 & TCP 49000 wire protocol specifications
│   ├── database.md           # Database design, Spring JDBC vs Hibernate rationale
│   ├── setup.md              # Installation, firewall configuration, demo guide
│   └── viva-notes.md         # Comprehensive viva Q&A for external examiners
├── build.bat                 # One-click Windows build script
├── run-meshnote.bat          # One-click production JAR runner
└── meshnote.jar              # Complete, ready-to-run fat JAR executable
```

---

## 7. Technical Documentation Index

For in-depth architectural and viva preparation details, consult the `docs/` directory:
- [System Architecture](file:///docs/architecture.md)
- [REST API Reference](file:///docs/api.md)
- [P2P Wire Protocol Specification](file:///docs/p2p-protocol.md)
- [Database Schema & Spring JDBC Guide](file:///docs/database.md)
- [Setup & Demonstration Guide](file:///docs/setup.md)
- [Viva & Oral Examination Guide](file:///docs/viva-notes.md)

---

## 8. License & Academic Attribution
Developed as an academic Full Stack Java project. All rights reserved.
