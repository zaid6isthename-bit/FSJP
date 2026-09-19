# MESHNOTE REST API Reference

The MESHNOTE backend exposes a clean, synchronous HTTP REST API on `http://localhost:8080/api`.
All responses follow a consistent `ApiResponse<T>` envelope format.

---

## 1. Response Envelope Format

### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": 1726732800000
}
```

### Standard Error Response
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "FILE_NOT_FOUND",
    "message": "Requested shared file id 42 does not exist."
  },
  "timestamp": 1726732800000
}
```

---

## 2. Dashboard Endpoints

### `GET /api/dashboard`
Returns high-level metric summaries for the overview dashboard widgets.

**Response:**
```json
{
  "success": true,
  "data": {
    "onlinePeers": 3,
    "availableFiles": 48,
    "sharedFiles": 12,
    "activeTransfers": 1,
    "totalDownloadedBytes": 145892040,
    "networkConnected": true,
    "localIp": "192.168.1.105",
    "tcpPort": 49000,
    "udpPort": 47777
  }
}
```

---

## 3. User Profile Endpoints

### `GET /api/profile`
Retrieves the local student user profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "peerId": "peer-9a7c4e21",
    "displayName": "Alex Chen",
    "avatarUrl": "/avatars/alex.png",
    "collegeName": "Stanford University",
    "department": "Computer Science",
    "semester": "Semester 3",
    "bio": "Distributed systems enthusiast",
    "isDiscoverable": true,
    "sharedFolder": "./data/shared",
    "downloadFolder": "./data/downloads"
  }
}
```

### `PUT /api/profile`
Updates local student profile settings.

**Request Body:**
```json
{
  "displayName": "Alex Chen",
  "avatarUrl": "/avatars/alex.png",
  "collegeName": "Stanford University",
  "department": "Computer Science",
  "semester": "Semester 3",
  "bio": "Studying OS and Networks",
  "isDiscoverable": true
}
```

---

## 4. Peer Discovery Endpoints

### `GET /api/peers`
Retrieves all currently discovered active peers on the local network.

**Query Parameters:**
- `status` *(optional)*: Filter by `ONLINE`, `AWAY`, `OFFLINE`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "peerId": "peer-4f91b012",
      "displayName": "Maya Lin",
      "avatarUrl": "",
      "ipAddress": "192.168.1.112",
      "tcpPort": 49000,
      "collegeName": "MIT",
      "department": "EECS",
      "semester": "Semester 3",
      "status": "ONLINE",
      "lastSeen": 1726732800000,
      "sharedFilesCount": 14
    }
  ]
}
```

### `GET /api/peers/{peerId}`
Retrieves detailed information and status for a single peer.

### `GET /api/peers/{peerId}/files`
Directly contacts the remote peer via TCP socket `LIST_FILES` command and returns their shared file catalog in real-time.

---

## 5. File Management & Discovery Endpoints

### `GET /api/files`
Returns files shared locally by this laptop.

**Query Parameters:**
- `category` *(optional)*: `NOTES`, `PAST_PAPERS`, `ASSIGNMENTS`, `LAB_MANUALS`, `SLIDES`, `BOOKS`
- `query` *(optional)*: Filter by title, tag, or course code

### `POST /api/files/share` (Multipart Form)
Uploads and indexes a new document into local shared storage.

**Form Parameters:**
- `file`: Binary file upload (`MultipartFile`)
- `courseCode`: Course identifier (e.g. `CS301`)
- `courseName`: Full course title (e.g. `Operating Systems`)
- `category`: Academic category enum
- `description`: Notes or summary
- `tags`: Comma-separated list of tags (e.g. `threads,memory,virtualization`)

### `GET /api/files/{id}`
Returns details for a locally shared file.

### `DELETE /api/files/{id}`
Deletes a file from the local library and removes it from sharing.

### `GET /api/files/discover`
Performs **Federated Network Discovery**:
1. Queries local H2 database for local matches.
2. Queries each connected online peer via TCP `LIST_FILES`.
3. Aggregates results into a single list with search filters.

**Query Parameters:**
- `q`: Search keyword
- `category`: Category filter
- `courseCode`: Course code filter

---

## 6. Transfer Management Endpoints

### `GET /api/transfers`
Returns all active, completed, and failed transfer jobs.

**Query Parameters:**
- `status` *(optional)*: `QUEUED`, `CONNECTING`, `DOWNLOADING`, `COMPLETED`, `FAILED`, `CANCELLED`
- `direction` *(optional)*: `DOWNLOAD`, `UPLOAD`

### `POST /api/transfers/download`
Initiates an asynchronous peer-to-peer download job. Returns immediately with the newly created transfer record while the transfer streams in the background.

**Request Body:**
```json
{
  "peerId": "peer-4f91b012",
  "peerIp": "192.168.1.112",
  "peerPort": 49000,
  "remoteFileId": "file-c081",
  "fileName": "OS_Unit3_VirtualMemory.pdf",
  "fileSize": 18451200
}
```

**Response (`202 Accepted` / `200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": 14,
    "fileId": "file-c081",
    "fileName": "OS_Unit3_VirtualMemory.pdf",
    "peerId": "peer-4f91b012",
    "peerName": "Maya Lin",
    "direction": "DOWNLOAD",
    "transferredBytes": 0,
    "totalBytes": 18451200,
    "status": "QUEUED",
    "speedBytesPerSec": 0,
    "errorMessage": null
  }
}
```

### `POST /api/transfers/{id}/cancel`
Cancels an ongoing transfer thread and updates status to `CANCELLED`.

---

## 7. Network & Diagnostics Endpoints

### `GET /api/network/status`
Returns real-time network binding information and socket diagnostics.

**Response:**
```json
{
  "success": true,
  "data": {
    "localIp": "192.168.1.105",
    "networkInterface": "wlan0 (Wi-Fi)",
    "udpPort": 47777,
    "tcpPort": 49000,
    "udpDiscoveryActive": true,
    "tcpServerActive": true,
    "knownPeersCount": 4
  }
}
```

### `POST /api/network/rescan`
Forces an immediate UDP broadcast ping across all broadcast addresses on the active subnet.

---

## 8. Notifications & Activity Log

### `GET /api/notifications`
Retrieves user notifications (e.g. "Peer discovered", "Transfer complete").

### `POST /api/notifications/{id}/read`
Marks a specific notification as read.

### `GET /api/activity`
Retrieves chronological audit log entries of network events (peer discovered, file shared, peer requested file).
