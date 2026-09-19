# MESHNOTE Setup & Demonstration Guide

This guide walks you through building, launching, and demonstrating MESHNOTE for presentations and semester project viva examinations.

---

## 1. System Requirements

- **Runtime**: Java 21 (or Java 17+) JRE / JDK
- **Network**: Any local Wi-Fi router, campus Wi-Fi, or phone mobile hotspot (**no internet required**)
- **Build Tools** (only if building from source):
  - Apache Maven 3.9+ (included in `.tools/` directory)
  - Node.js 18+ & npm (for frontend compilation)

---

## 2. Quick Start: Running the Prebuilt Application

The repository includes a ready-to-run, all-in-one executable JAR file containing both the React frontend and Spring Boot backend:

```bash
# Double-click or run from terminal:
java -jar meshnote.jar
```

1. Open your browser to **`http://localhost:8080`**.
2. Complete the 1-time setup modal (enter your Name, College, and Semester).
3. You are now live on the local academic mesh network!

---

## 3. Two-Laptop Viva Demonstration (The Real Setup)

This is the recommended setup for your viva examination. It proves zero-cloud peer-to-peer communication between physical computers.

```text
       [ Smartphone Mobile Hotspot or Wi-Fi Router ]
                     (No Internet Required)
                     /                    \
                    /                      \
          192.168.43.102              192.168.43.105
        +----------------+          +----------------+
        |    Laptop A    |          |    Laptop B    |
        |  (Alex Chen)   |          |  (Maya Lin)    |
        |                |          |                |
        | UI: :8080      |          | UI: :8080      |
        | TCP: 49000     |          | TCP: 49000     |
        | UDP: 47777     |<-------->| UDP: 47777     |
        +----------------+          +----------------+
```

### Step 1: Connect Both Laptops to the Same Network
- Turn on your smartphone's Mobile Hotspot (you can even turn off cellular data!).
- Connect both Laptop A and Laptop B to the hotspot.

### Step 2: Configure Windows Defender Firewall (First Time Only)
When you first run `java -jar meshnote.jar`, Windows Firewall may prompt:
- Check **"Private networks (such as home or work network)"**.
- Click **"Allow access"**.
*(If blocked previously: Open Windows Security -> Firewall & network protection -> Allow an app through firewall -> check Java(TM) Platform SE binary on Private networks).*

### Step 3: Launch MESHNOTE on Both Laptops
- On **Laptop A**: Run `java -jar meshnote.jar` -> Open `http://localhost:8080`
- On **Laptop B**: Run `java -jar meshnote.jar` -> Open `http://localhost:8080`

### Step 4: Verify Discovery
Within **5 seconds**:
- Laptop A automatically displays Laptop B in the **Nearby Peers** page and the interactive **Network Topology Graph**.
- Laptop B simultaneously displays Laptop A.

### Step 5: Share and Transfer a File
1. On Laptop A: Go to **My Library** -> Click **Share Academic File** -> Upload a PDF or document (e.g. `OS_Lecture_Notes.pdf`).
2. On Laptop B: Go to **Discover** or **Nearby Peers** -> Click on Laptop A.
3. Laptop B sees `OS_Lecture_Notes.pdf` listed in real-time.
4. Click **Download**:
   - Laptop B's UI transitions to **Transfers** page showing the animated progress bar and throughput speed.
   - The file streams directly over raw TCP socket port `49000` into Laptop B's `./data/downloads/` folder.
   - Laptop A's access count increments automatically.

---

## 4. Single-Laptop Simulation (Development / Offline Demo)

If you only have one physical laptop available during testing or preparation:

### Instance 1 (Primary Node):
```bash
java -jar meshnote.jar --server.port=8080 --meshnote.p2p.tcp-port=49000 --meshnote.p2p.udp-port=47777
```
Access at `http://localhost:8080`.

### Instance 2 (Simulated Peer):
```bash
java -jar meshnote.jar --server.port=8081 --meshnote.p2p.tcp-port=49001 --meshnote.p2p.udp-port=47778
```
Access at `http://localhost:8081`.

---

## 5. Building from Source

To compile both frontend and backend and package into `meshnote.jar`:

### Windows
```cmd
build.bat
```

### Linux / macOS
```bash
cd frontend && npm install && npm run build
cp -r dist/* ../backend/src/main/resources/static/
cd ../backend && mvn clean package -DskipTests
cp target/meshnote.jar ../meshnote.jar
```
