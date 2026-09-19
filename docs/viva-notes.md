# MESHNOTE Viva & Oral Examination Guide

This document prepares you for technical questions from your professor or external examiner during your Semester 3 Full Stack Java viva examination.

---

## 1. High-Level Concept & Architecture

### Q1: What is MESHNOTE in one sentence?
> **Answer**: "MESHNOTE is a decentralized, offline-first peer-to-peer academic knowledge network that enables students on the same local Wi-Fi or mobile hotspot to discover each other and transfer academic study material directly without relying on any external internet or cloud server."

### Q2: Why didn't you use WebRTC or a cloud backend like Firebase?
> **Answer**:
> 1. **Zero Internet Constraint**: College classrooms and exam halls often have unstable or restricted internet. MESHNOTE works in complete isolation on a local hotspot with cellular data turned off.
> 2. **Browser Sandbox**: Web browsers cannot bind raw UDP or TCP sockets. WebRTC requires external STUN/TURN signaling servers.
> 3. **True Systems Programming**: Handling raw Java `DatagramSocket` and `ServerSocket` directly demonstrates core networking principles (OSI Layer 4 Transport protocols) instead of relying on third-party SaaS abstractions.

---

## 2. Networking & Socket Programming

### Q3: Why did you use UDP for discovery, but TCP for file transfer?
> **Answer**:
> - **UDP (User Datagram Protocol)** is **connectionless and supports broadcasting**. We use UDP on port `47777` because a laptop doesn't know who is on the network beforehand. It broadcasts a single `HELLO` packet to `255.255.255.255` which every listening laptop receives without requiring prior connection handshakes.
> - **TCP (Transmission Control Protocol)** is **connection-oriented, reliable, and byte-ordered**. File sharing cannot tolerate dropped packets or corrupted bytes. TCP on port `49000` guarantees flow control, error detection, and complete document integrity.

### Q4: How does a node detect that a peer has left the network?
> **Answer**:
> "We implement a **heartbeat timeout** mechanism:
> - Every online node broadcasts a UDP `HELLO` beacon every 5 seconds.
> - The `PeerRegistryService` tracks the `lastSeen` timestamp for each peer.
> - If 15 seconds pass without a heartbeat, the peer status transitions to `AWAY`.
> - If 30 seconds pass, the peer transitions to `OFFLINE`.
> - Additionally, when a user gracefully exits MESHNOTE, a UDP `BYE` packet is broadcast, instantly marking them offline."

### Q5: How do you stream a 200MB PDF without crashing Java memory (OutOfMemoryError)?
> **Answer**:
> "We never read the entire file into a byte array in heap memory. In `TcpP2pServer` and `P2pClient`, we use a fixed **64 KB buffer** (`byte[65536]`). We stream chunks directly from the disk's `FileInputStream` into the socket's `OutputStream`. Java's garbage collector only handles the 64 KB buffer, allowing files of any size (even multi-gigabyte files) to be transferred smoothly with minimal RAM usage."

---

## 3. Database & Persistence

### Q6: Why did you choose Spring `JdbcTemplate` instead of Hibernate or Spring Data JPA?
> **Answer**:
> 1. **Academic Transparency**: With `JdbcTemplate`, every SQL query (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) is explicitly written in our repository classes. In a viva, we can explain the exact relational schema and query plan without hidden ORM proxies.
> 2. **Performance & Footprint**: Hibernate brings heavy entity lifecycle state machines, reflection, and caching layers that add unnecessary overhead to a lightweight desktop node.
> 3. **Deterministic Behavior**: Direct JDBC execution ensures that database updates occur immediately during file transfer progress ticks without delayed dirty-checking flushes.

### Q7: How do you prevent SQL Injection?
> **Answer**:
> "We use **parameterized queries** in every `JdbcTemplate` call. Arguments are passed as bind variables (`?`), which compile into JDBC `PreparedStatement` instances. The database engine treats parameter inputs strictly as literal values rather than executable SQL code, completely eliminating SQL injection vectors."

### Q8: Where is the data stored?
> **Answer**:
> "We use an embedded **H2 Database Engine** running in persistent file mode at `./data/database/meshnotedb`. The database file is created locally on the student's laptop and survives restarts. We also include `AUTO_SERVER=TRUE` in the connection string, allowing external tools to connect concurrently for inspection."

---

## 4. Concurrency & Operating System Concepts

### Q9: How do you prevent the UI from freezing during a long file download?
> **Answer**:
> "File downloads are **strictly asynchronous**:
> 1. When the user clicks download, `POST /api/transfers/download` creates a transfer record with status `QUEUED` and immediately returns `202 Accepted` with the `transferId`.
> 2. The transfer is dispatched to an internal `ExecutorService` thread pool.
> 3. The background thread opens the TCP socket and streams data while periodically updating the transferred byte count in the database.
> 4. The React UI polls `GET /api/transfers` every 1–2 seconds to render smooth progress bars without blocking the main event loop."

### Q10: How does the TCP server handle multiple peers requesting files at the same time?
> **Answer**:
> "In `TcpP2pServer`, the main thread sits in an infinite `while (running)` loop calling `serverSocket.accept()`. When a remote peer connects, the returned `Socket` connection is immediately handed off to a managed worker thread pool (`Executors.newCachedThreadPool()`). The main thread immediately resumes listening for the next incoming connection."

---

## 5. Security & Robustness

### Q11: How do you prevent a malicious peer from accessing private files on your computer?
> **Answer**:
> "We implemented a custom utility class called **`PathSanitizer`**:
> - All incoming file requests are validated before opening disk handles.
> - Path separators (`/`, `\`), directory traversal sequences (`..`), and null bytes are stripped and rejected.
> - File lookups are strictly constrained to the sandboxed `./data/shared/` directory. Even if a peer requests `../../Windows/System32`, `PathSanitizer` blocks the request."

---

## 6. Summary Cheat Sheet for the Viva

| Feature | Technology Used | Viva Keyword |
|---|---|---|
| **Peer Discovery** | UDP DatagramSocket on Port 47777 | Connectionless Broadcast |
| **File Transfer** | TCP ServerSocket on Port 49000 | Reliable Byte Stream, 64KB Buffer |
| **Persistence** | Spring `JdbcTemplate` + H2 File DB | Parameterized Queries, Zero ORM overhead |
| **Concurrency** | Java `ExecutorService` Thread Pool | Non-blocking Async Transfers |
| **Frontend** | React 18 + Tailwind CSS (Stitch) | Responsive SPA, Polling Architecture |
| **Packaging** | Spring Boot Fat JAR (`meshnote.jar`) | Single Executable, Embedded Tomcat |
