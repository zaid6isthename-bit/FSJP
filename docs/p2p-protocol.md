# MESHNOTE P2P Wire Protocol Specification

Version: **1.0**  
Network Layer: **Local Area Network (LAN) / WLAN**  
Transport Protocols: **UDP (Discovery) & TCP (Data Streaming)**

---

## 1. Overview

MESHNOTE uses a hybrid dual-transport networking architecture:
- **UDP on port `47777`** handles lightweight, zero-configuration peer discovery via broadcast beacons.
- **TCP on port `49000`** provides reliable, ordered data transport for file indexing and high-throughput binary file streaming.

No centralized tracker, DHT, or external rendezvous server is used.

```text
    +-------------+                              +-------------+
    |   Node A    |                              |   Node B    |
    +------+------+                              +------+------+
           |                                            |
           | ----- UDP Broadcast :47777 (HELLO) ------->|
           |<----- UDP Broadcast :47777 (HELLO) --------|
           |                                            |
           | ===== TCP Connect :49000 (LIST_FILES) ====>|
           |<===== TCP JSON File Catalog ===============|
           |                                            |
           | ===== TCP Connect :49000 (GET_FILE) ======>|
           |<===== TCP JSON Header + Raw Byte Stream ==|
           |                                            |
```

---

## 2. UDP Discovery Protocol (Port 47777)

### 2.1 Broadcast Mechanism
Every node binds a `DatagramSocket` to UDP port `47777` with `SO_BROADCAST` enabled. Every **5 seconds**, each node sends a discovery packet to `255.255.255.255` and local subnet broadcast addresses.

### 2.2 Packet Format
Packets are sent as UTF-8 encoded JSON strings (maximum 1024 bytes):

```json
{
  "magic": "MESHNOTE",
  "version": 1,
  "type": "HELLO",
  "peerId": "peer-9a7c4e21",
  "displayName": "Alex Chen",
  "ipAddress": "192.168.1.105",
  "tcpPort": 49000,
  "collegeName": "Stanford University",
  "department": "Computer Science",
  "semester": "Semester 3",
  "sharedFilesCount": 12
}
```

### 2.3 Packet Types
1. **`HELLO`**: Periodic heartbeat announcing the node's presence, display name, and active TCP port.
2. **`BYE`**: Graceful shutdown notification transmitted when the user exits the application.

### 2.4 Peer Lifecycle & Timeouts
- **ONLINE**: Node received a `HELLO` packet within the last 15 seconds.
- **AWAY**: Node has not transmitted a heartbeat for 15–30 seconds.
- **OFFLINE**: Node has not transmitted a heartbeat for >30 seconds or transmitted a `BYE` packet.

---

## 3. TCP Data Protocol (Port 49000)

All TCP operations occur on port `49000`. The protocol operates on a single request-response cycle per connection, ensuring simplicity and clean connection termination.

### 3.1 Framing
Every client request begins with a **single UTF-8 JSON line terminated by a newline (`\n`)**:
```text
{"command": "<COMMAND_NAME>", ...}\n
```

### 3.2 Command Set

#### Command 1: `PING`
Used to verify socket reachability and remote peer identity.

- **Request:**
  ```json
  {"command": "PING"}
  ```
- **Response:**
  ```json
  {"status": "PONG", "peerId": "peer-4f91b012", "displayName": "Maya Lin"}
  ```

---

#### Command 2: `LIST_FILES`
Requests the peer's public catalog of shared academic materials.

- **Request:**
  ```json
  {"command": "LIST_FILES"}
  ```
- **Response:**
  ```json
  {
    "status": "OK",
    "files": [
      {
        "fileId": "file-101",
        "fileName": "CN_Unit2_SocketProgramming.pdf",
        "fileSize": 4194304,
        "courseCode": "CS302",
        "courseName": "Computer Networks",
        "category": "NOTES",
        "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      }
    ]
  }
  ```

---

#### Command 3: `GET_FILE`
Requests direct binary streaming of an academic document.

- **Request:**
  ```json
  {"command": "GET_FILE", "fileId": "file-101"}
  ```

- **Response Header (Single JSON line terminated by `\n`):**
  ```json
  {"status": "OK", "fileName": "CN_Unit2_SocketProgramming.pdf", "fileSize": 4194304, "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
  ```

- **Binary Payload:**
  Immediately following the newline character (`\n`), the sending peer flushes the raw file bytes through the socket using a **64 KB buffer** (`byte[65536]`). The connection is closed once `fileSize` bytes are sent.

- **Error Response (if file missing or restricted):**
  ```json
  {"status": "ERROR", "message": "File not found or access restricted"}
  ```

---

## 4. Security & Robustness Measures

1. **Path Traversal Protection (`PathSanitizer`)**:
   Incoming `fileId` and `fileName` parameters are strictly sanitized:
   - Any `..`, `/`, `\`, or null bytes are rejected.
   - Files are resolved exclusively inside the sandboxed `./data/shared/` directory.
2. **Loopback & Self-Echo Filtering**:
   Nodes check the `peerId` in received UDP packets. Packets matching the local `peerId` are silently ignored.
3. **Chunked Streaming**:
   Large PDF documents (100MB+) stream directly from disk to socket without loading the entire file into Java heap memory, preventing `OutOfMemoryError`.
