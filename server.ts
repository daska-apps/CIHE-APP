import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for demonstration (in production this would be a DB)
let attendanceRecords: any[] = [
  { id: '1', studentId: 'CIHE21351', name: 'Student CIHE21351', status: 'present', timestamp: new Date().toISOString() },
  { id: '2', studentId: 'CIHE21544', name: 'Student CIHE21544', status: 'absent', timestamp: new Date().toISOString() },
  { id: '3', studentId: 'CIHE21603', name: 'Student CIHE21603', status: 'present', timestamp: new Date().toISOString() },
];

let memories: any[] = [
  { id: 'm1', content: 'Remind me to check census date next week', category: 'Task', timestamp: new Date().toISOString() }
];

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Memory API
app.get("/api/memories", (req, res) => {
  res.json(memories);
});

app.post("/api/memories", (req, res) => {
  const newMemory = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    timestamp: new Date().toISOString()
  };
  memories.push(newMemory);
  res.status(201).json(newMemory);
});

app.delete("/api/memories/:id", (req, res) => {
  const { id } = req.params;
  memories = memories.filter(m => m.id !== id);
  res.status(204).send();
});

// Attendance API
app.get("/api/attendance", (req, res) => {
  res.json(attendanceRecords);
});

app.post("/api/attendance", (req, res) => {
  const newRecord = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    timestamp: new Date().toISOString()
  };
  attendanceRecords.push(newRecord);
  res.status(201).json(newRecord);
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CIHE Portal Server running on http://localhost:${PORT}`);
  });
}

startServer();
