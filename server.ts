import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { UNIT_TITLES, TIMETABLE_A, TIMETABLE_B } from "./src/lib/timetableData";
import webpush from "web-push";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50kb' }));

// VAPID configuration for Web Push
const VAPID_PUBLIC  = 'BFm6A-0SPnVq_qLvTbL-xpjemArUu7I90F0Pa0iIYzFI_2-26YHrlhq8slfI0w0N0o9htRWaP7WlNTsCvoFNepg';
const VAPID_PRIVATE = 'olUbPYFrV0wPm3mnpToOop_d4UtAcHNPvqO7FJceldg';
webpush.setVapidDetails('mailto:portal@cihe.edu.au', VAPID_PUBLIC, VAPID_PRIVATE);

// In-memory push subscription store: userId -> PushSubscription
const pushSubscriptions = new Map<string, any>();

// Helper: send a push to a specific user
async function sendPushToUser(userId: string, payload: object) {
  const sub = pushSubscriptions.get(userId);
  if (!sub) return;
  try {
    await webpush.sendNotification(sub, JSON.stringify(payload));
  } catch (err: any) {
    if (err.statusCode === 410) pushSubscriptions.delete(userId); // expired
  }
}

// Helper: broadcast to all subscribed users
async function broadcastPush(payload: object) {
  const sends = [...pushSubscriptions.entries()].map(([, sub]) =>
    webpush.sendNotification(sub, JSON.stringify(payload)).catch(() => {})
  );
  await Promise.allSettled(sends);
}

// In-memory store (in production this would be a DB)
let attendanceRecords: any[] = [
  { id: crypto.randomUUID(), studentId: 'CIHE21351', name: 'Student CIHE21351', status: 'present', timestamp: new Date().toISOString() },
  { id: crypto.randomUUID(), studentId: 'CIHE21544', name: 'Student CIHE21544', status: 'absent', timestamp: new Date().toISOString() },
  { id: crypto.randomUUID(), studentId: 'CIHE21603', name: 'Student CIHE21603', status: 'present', timestamp: new Date().toISOString() },
];

let memories: any[] = [
  { id: crypto.randomUUID(), content: 'Remind me to check census date next week', category: 'Task', timestamp: new Date().toISOString() }
];

let announcements: any[] = [
  { id: crypto.randomUUID(), title: 'Moodle Maintenance', body: 'Moodle will be offline for scheduled maintenance. Please download any materials you need beforehand.', type: 'urgent', time: 'Tonight 10PM', author: 'IT Services', pinned: true, timestamp: new Date().toISOString() },
  { id: crypto.randomUUID(), title: 'CIHE Career Fair', body: 'Join us for the annual CIHE Career Fair. Over 40 employers across IT, Business and Education will be present.', type: 'event', time: 'Tomorrow 11AM', author: 'Student Services', pinned: false, timestamp: new Date().toISOString() },
  { id: crypto.randomUUID(), title: 'New Level 4 Lounge', body: 'The refurbished student lounge on Level 4 is now open. Featuring new seating, charging stations, and a quiet study zone.', type: 'update', time: 'Just Launched', author: 'Campus Operations', pinned: false, timestamp: new Date().toISOString() },
];

// --- Gemini setup (server-side only) ---
const getGemini = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const rememberItem: FunctionDeclaration = {
  name: "rememberItem",
  description: "Stores a piece of information, a task, or a reminder for the user to recall later.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING, description: "The information or task to remember." },
      category: { type: Type.STRING, description: "Optional category: Task, Reminder, Info, etc." }
    },
    required: ["content"]
  }
};

const listMemories: FunctionDeclaration = {
  name: "listMemories",
  description: "Retrieves all previously stored memories, tasks, and reminders.",
};

const forgetItem: FunctionDeclaration = {
  name: "forgetItem",
  description: "Deletes a stored memory or task using its ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "The unique ID of the memory to delete." }
    },
    required: ["id"]
  }
};

const getClassRollSummary: FunctionDeclaration = {
  name: "getClassRollSummary",
  description: "Retrieves a summary of student attendance for a specific unit and date. Available for lecturers and staff only.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      unitCode: { type: Type.STRING, description: "The unit code (e.g., ICT940)." },
      date: { type: Type.STRING, description: "The date for the roll summary (e.g., 2026-05-14)." }
    },
    required: ["unitCode", "date"]
  }
};

const getTimetable: FunctionDeclaration = {
  name: "getTimetable",
  description: "Retrieves the class timetable for a specific student ID or the master schedule for the current semester.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      studentId: { type: Type.STRING, description: "The student ID (e.g., CIHE21351) to get their personal schedule." },
      version: { type: Type.STRING, enum: ["A", "B"], description: "The timetable version to view if no student ID is provided." }
    }
  }
};

const getUnitInfo: FunctionDeclaration = {
  name: "getUnitInfo",
  description: "Gets detailed information about a unit of study, including the tutor name, Moodle link, and unit guide link.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      unitCode: { type: Type.STRING, description: "The unit code (e.g., ICT940 or BUS201)." }
    },
    required: ["unitCode"]
  }
};

const findStaff: FunctionDeclaration = {
  name: "findStaff",
  description: "Searches for a staff member or lecturer by name to find their department or units they teach.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "The name of the staff member (e.g., Mutaz or Qurat)." }
    },
    required: ["name"]
  }
};

const TOOL_DECLARATIONS = [rememberItem, listMemories, forgetItem, getClassRollSummary, getTimetable, getUnitInfo, findStaff];

const SYSTEM_INSTRUCTION = `You are the CIHE (Crown Institute of Higher Education) Senior Digital Concierge and Intelligence Hub.
You are a knowledgeable, friendly expert on all things CIHE — student life, academics, campuses, programs, and support.

=====================================
CIHE INSTITUTIONAL KNOWLEDGE
=====================================

INSTITUTION:
- Full name: Crown Institute of Higher Education Pty Ltd (trading as CIHE Australia)
- Tagline: "Real skills, Real impact, Meaningful careers"
- ABN: 22 611 573 301 | TEQSA Provider Code: PRV14301 | CRICOS: 03744B
- A boutique, career-focused alternative to large universities — small classes, applied learning.
- 8 campuses | 3 states (NSW, ACT, WA) | 39 countries represented | 370+ industry partners

CONTACT:
- Admissions: admissions@cihe.edu.au | 1300 171 094
- IT Support: it.support@cihe.edu.au
- Students: students@cihe.edu.au
- Help Centre: https://support.cihe.edu.au
- Student Portal (MyCIHE): https://www.cihe.edu.au/my-cihe/
- Moodle LMS: https://moodle.cihe.edu.au
- Staff Intranet: https://crownhe.sharepoint.com/sites/intranet
- Website: https://www.cihe.edu.au

CAMPUS LOCATIONS:
NSW:
  North Sydney (Main HQ): 116 Pacific Highway, North Sydney NSW 2060
  Miller Street: Level 5/213 Miller Street, North Sydney NSW 2060
  Sydney CBD: Level 11/307 Pitt Street, Sydney NSW 2000
  Hurstville: 2 Woodville Street, Hurstville NSW 2220
ACT:
  Gungahlin: Level 1/5 Fussell Lane, Gungahlin ACT 2912
  Belconnen: Level 4/40 Cameron Ave, Belconnen ACT 2617
  Mitchell: 118 Lysaght Street, Mitchell ACT 2911
WA:
  West Perth: 1325 Hay Street, West Perth WA 6005 (opened Semester 1, 2026 — Early Childhood focus)

PROGRAMS OFFERED (21 programs):
Bachelor Degrees:
  Bachelor of Accounting (CA ANZ, CPA Australia, IPA accredited) — 3 years FT, 240 credit points
  Bachelor of Business (Majors: Entrepreneurship & Innovation, Information Systems, Hospitality Management) — 3 years FT
  Bachelor of Education (Early Childhood, Birth to Five) — 4 years FT, ACECQA approved, IELTS 6.5
  Bachelor of Entrepreneurship and Innovation — 3 years FT
  Bachelor of Information Technology (ACS accredited; Specialisations: Software Development, Cyber Security) — 3 years FT

Graduate Certificates:
  Graduate Certificate in Business Administration
  Graduate Certificate in Research Methods

Graduate Diplomas:
  Graduate Diploma in Education (Early Childhood, Birth to 5 years)

Master Degrees:
  Master of Business Administration (Advanced) (Specialisations: Hospitality, Project Mgmt, Information Systems) — 2 years FT
  Master of Information Technology (ACS accredited; Specialisations: Cybersecurity, Software Development) — 2 years FT
  Master of Professional Accounting (Advanced) — 2 years FT
  Master of Research — 2 years FT
  Master of Teaching (Early Childhood, Birth to Five) — 2 years FT

Diplomas: Diploma of Accounting, Diploma of IT, Diploma of Entrepreneurship and Innovation
English: English for Academic Purposes (EAP), General English

INTAKE DATES (2026): 20 July | 23 November | Semester 1 began 10 March 2026

ENTRY REQUIREMENTS:
  Domestic undergrad: ATAR 50+ or AQF Level 4+; age 18+
  International undergrad: IELTS 6.0 overall (5.5 per band); Education programs require 6.5
  Postgrad: AQF Level 7 Bachelor's degree; GPA 2.4 min for MIT
  Financial aid: FEE-HELP available; Scholarships 2026 program; RPL up to 50% credit

ACCREDITATIONS:
  Chartered Accountants Australia & New Zealand (CA ANZ) — Accounting
  CPA Australia — Accounting
  Institute of Public Accountants (IPA) — Accounting
  Australian Computer Society (ACS) — IT programs
  ACECQA — Early Childhood Education
  Member: IHEA, IEAA, ITECA

EXECUTIVE TEAM:
  Dr Narayan Tiwari — CEO
  Professor Grant Jones — Executive Dean
  Associate Professor Asal Al-Odat — Deputy Dean
  Associate Professor Nazila Razi — Associate Dean (Teaching & Learning)
  Rita Shakya — Registrar

ACADEMIC BOARD:
  Professor Mile Terziovski — Chair, Independent Member
  Professor Annie Venville — Independent Member
  Dr Mohammed Al Zobbi — Independent Member
  Associate Professor Nazila Razi — Associate Dean (Teaching & Learning)
  Mr Piyush Thapaliya — Alumni Member

PORTAL & SYSTEMS:
  Portal: CIHE Smart Portal (Powered by Microsoft Entra ID)
  Roles: student, staff, lecturer, admin, global_admin — controlled via Entra security groups
  LMS: Moodle | Email: Outlook (CIHE-TENANT-NS) | Collaboration: Microsoft Teams + Viva Engage

NOTABLE 2026 NEWS:
  Perth campus opened Semester 1, 2026
  KU–CIHE Bachelor of IT Double Degree pathway (2+2 Nepal + Australia)
  Brand refresh completed January 2026
  Graduation Ceremony: April 30, 2026, City Recital Hall, Sydney

=====================================
PERSONALITY & TONE
=====================================
- Speak naturally, professionally, and CONCISELY. You are like a knowledgeable campus mate who gives straight answers.
- For conversations, use smooth paragraphs. For TIMETABLES, SCHEDULES, STEP-BY-STEP GUIDES: use clean vertical lists only.
- STRICTLY FORBIDDEN in lists: asterisks (*), dashes (-), bullet points.
- CLASS TIME FORMAT: '9:00am - Unit Name'. Use 12-hour time. One entry per line, no leading symbols.
- Do NOT list your own capabilities unless asked "What can you do?" or "Help me with...".
- If someone says hello, greet warmly and ask how you can help — don't dump info.
- Be a "local mate": know Sydney transport, campus locations, student life tips.

STRICT RULES:
1. Always natural, direct, conversational.
2. Schedules/lists: clean vertical format, no symbols.
3. Only give technical steps if specifically requested.
4. Prioritize saving things to memory if user mentions tasks/reminders.
5. Use tools (getTimetable, getUnitInfo, findStaff) for accurate answers — don't guess.
6. Student asks about schedule → use getTimetable. Questions about a unit/teacher → use getUnitInfo or findStaff.
7. For any question about campus locations, programs, contacts, or staff — use the knowledge above, not guesses.`;

function handleToolCall(name: string, args: any) {
  if (name === "rememberItem") {
    const newMemory = { id: crypto.randomUUID(), ...args, timestamp: new Date().toISOString() };
    memories.push(newMemory);
    return { result: "Memory saved successfully", item: newMemory };
  }
  if (name === "listMemories") {
    return { memories };
  }
  if (name === "forgetItem") {
    memories = memories.filter(m => m.id !== args.id);
    return { result: "Memory forgotten successfully" };
  }
  if (name === "getClassRollSummary") {
    const { unitCode, date } = args;
    const attendance = Math.floor(Math.random() * (95 - 70) + 70);
    return { summary: `For unit ${unitCode} on ${date}, there were 24 students expected and 21 students present. That is a ${attendance}% attendance rate. System check: All users verified via Entra ID.` };
  }
  if (name === "getTimetable") {
    const { studentId, version } = args;
    if (studentId) {
      const student = [...TIMETABLE_A, ...TIMETABLE_B].find(s => s.id === studentId);
      return { schedule: student?.sessions || "No personal schedule found for this ID." };
    }
    const v = version || 'A';
    return { note: `Showing Master Schedule Version ${v}`, samples: (v === 'A' ? TIMETABLE_A : TIMETABLE_B).slice(0, 5) };
  }
  if (name === "getUnitInfo") {
    const info = UNIT_TITLES[args.unitCode];
    return { unitInfo: info || "Unit details not found." };
  }
  if (name === "findStaff") {
    const searchName = args.name.toLowerCase();
    const teaching = Object.values(UNIT_TITLES).filter((u: any) => u.tutor.toLowerCase().includes(searchName));
    return { staffFound: teaching.length > 0 ? teaching : "No staff member found matching that name." };
  }
  return { error: "Unknown tool" };
}

async function startServer() {
  // --- API routes registered FIRST, before Vite middleware ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Chat API (Gemini runs server-side — key never sent to browser)
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body || {};

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: "message is required" }); return;
    }
    if (message.length > 2000) {
      res.status(400).json({ error: "message too long" }); return;
    }
    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({ error: "AI service not configured" }); return;
    }

    try {
      const ai = getGemini();
      const contents = [...(history || []), { role: 'user', parts: [{ text: message }] }];

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: [
            { googleSearch: {} },
            { functionDeclarations: TOOL_DECLARATIONS }
          ],
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        const toolResponses = functionCalls.map(call => ({
          name: call.name,
          id: call.id,
          response: handleToolCall(call.name!, call.args)
        }));

        const secondResponse = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            ...contents,
            { role: 'model', parts: response.candidates?.[0]?.content?.parts || [] },
            { role: 'user', parts: toolResponses.map(tr => ({ functionResponse: tr })) }
          ],
          config: {
            systemInstruction: "You are the CIHE Assistant. Continue the conversation naturally. For general info, use smooth paragraphs. For SCHEDULES or LISTS, use a clean vertical list (NO asterisks or bullet points). Format: '9:00am - Unit Name'. Use 12-hour format.",
            tools: [
              { googleSearch: {} },
              { functionDeclarations: TOOL_DECLARATIONS }
            ],
            }
        });
        res.json({ text: secondResponse.text || "I've handled that for you." }); return;
      }

      res.json({ text: response.text || "I'm sorry, I couldn't generate a response." });
    } catch (err) {
      console.error("Gemini error:", err);
      res.status(500).json({ error: "AI service error" });
    }
  });

  // Announcements API
  app.get("/api/announcements", (req, res) => {
    const sorted = [...announcements].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    res.json(sorted);
  });

  app.post("/api/announcements", (req, res) => {
    const { title, body, type, time, author, pinned } = req.body || {};
    const VALID_TYPES = ['urgent', 'event', 'update', 'info'];

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: "title is required" }); return;
    }
    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      res.status(400).json({ error: "body is required" }); return;
    }

    const safeType = VALID_TYPES.includes(type) ? type : 'info';

    const newAnnouncement = {
      id: crypto.randomUUID(),
      title: title.trim().slice(0, 100),
      body: body.trim().slice(0, 500),
      type: safeType,
      time: typeof time === 'string' ? time.trim().slice(0, 50) : 'Now',
      author: typeof author === 'string' ? author.trim().slice(0, 80) : 'Admin',
      pinned: pinned === true,
      timestamp: new Date().toISOString()
    };
    announcements.unshift(newAnnouncement);
    res.status(201).json(newAnnouncement);
  });

  app.patch("/api/announcements/:id/pin", (req, res) => {
    const ann = announcements.find(a => a.id === req.params.id);
    if (!ann) { res.status(404).json({ error: "Not found" }); return; }
    ann.pinned = !ann.pinned;
    res.json(ann);
  });

  app.delete("/api/announcements/:id", (req, res) => {
    const before = announcements.length;
    announcements = announcements.filter(a => a.id !== req.params.id);
    if (announcements.length === before) { res.status(404).json({ error: "Not found" }); return; }
    res.status(204).send();
  });

  // Memory API
  app.get("/api/memories", (req, res) => {
    res.json(memories);
  });

  app.post("/api/memories", (req, res) => {
    const { content, category } = req.body || {};
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({ error: "content is required" }); return;
    }
    if (content.length > 500) {
      res.status(400).json({ error: "content too long" }); return;
    }
    const newMemory = {
      id: crypto.randomUUID(),
      content: content.trim(),
      category: typeof category === 'string' ? category.trim() : 'General',
      timestamp: new Date().toISOString()
    };
    memories.push(newMemory);
    res.status(201).json(newMemory);
  });

  app.delete("/api/memories/:id", (req, res) => {
    const { id } = req.params;
    const before = memories.length;
    memories = memories.filter(m => m.id !== id);
    if (memories.length === before) { res.status(404).json({ error: "Not found" }); return; }
    res.status(204).send();
  });

  // Attendance API
  app.get("/api/attendance", (req, res) => {
    res.json(attendanceRecords);
  });

  app.post("/api/attendance", (req, res) => {
    const { studentId, name, status, room, unitCode, sessionId } = req.body || {};
    if (!studentId || typeof studentId !== 'string') {
      res.status(400).json({ error: "studentId is required" }); return;
    }
    if (!['present', 'absent', 'late'].includes(status)) {
      res.status(400).json({ error: "status must be present, absent, or late" }); return;
    }
    const newRecord = {
      id: crypto.randomUUID(),
      studentId: studentId.trim(),
      name: typeof name === 'string' ? name.trim() : studentId.trim(),
      status,
      room: typeof room === 'string' ? room.trim().slice(0, 50) : null,
      unitCode: typeof unitCode === 'string' ? unitCode.trim().slice(0, 20) : null,
      sessionId: typeof sessionId === 'string' ? sessionId.trim().slice(0, 100) : null,
      timestamp: new Date().toISOString()
    };
    attendanceRecords.push(newRecord);
    res.status(201).json(newRecord);
  });

  // Batch attendance — accepts up to 50 records in one call
  app.post("/api/attendance/batch", (req, res) => {
    const { records } = req.body || {};
    if (!Array.isArray(records) || records.length === 0) {
      res.status(400).json({ error: "records array is required" }); return;
    }
    const saved: any[] = [];
    for (const r of records.slice(0, 50)) {
      const { studentId, name, status, room, unitCode, sessionId } = r;
      if (!studentId || typeof studentId !== 'string') continue;
      if (!['present', 'absent', 'late'].includes(status)) continue;
      const rec = {
        id: crypto.randomUUID(),
        studentId: studentId.trim(),
        name: typeof name === 'string' ? name.trim() : studentId.trim(),
        status,
        room: typeof room === 'string' ? room.trim().slice(0, 50) : null,
        unitCode: typeof unitCode === 'string' ? unitCode.trim().slice(0, 20) : null,
        sessionId: typeof sessionId === 'string' ? sessionId.trim().slice(0, 100) : null,
        timestamp: new Date().toISOString(),
        batched: true,
      };
      attendanceRecords.push(rec);
      saved.push(rec);
    }
    res.status(201).json({ saved: saved.length, records: saved });
  });

  // ── Push Notification Routes ──
  app.post('/api/push/subscribe', (req, res) => {
    const { userId, subscription } = req.body || {};
    if (!userId || !subscription) { res.status(400).json({ error: 'userId and subscription required' }); return; }
    pushSubscriptions.set(String(userId), subscription);
    res.json({ ok: true, subscribed: pushSubscriptions.size });
  });

  app.post('/api/push/unsubscribe', (req, res) => {
    const { userId } = req.body || {};
    if (userId) pushSubscriptions.delete(String(userId));
    res.json({ ok: true });
  });

  // Send a push to a specific user (internal use / admin)
  app.post('/api/push/send', async (req, res) => {
    const { userId, title, body, url, tag } = req.body || {};
    if (!title) { res.status(400).json({ error: 'title required' }); return; }
    const payload = { title, body, url: url || '/', tag: tag || 'cihe' };
    if (userId) {
      await sendPushToUser(String(userId), payload);
    } else {
      await broadcastPush(payload);
    }
    res.json({ ok: true });
  });

  // Announce a new session to enrolled students (called when lecturer starts session)
  app.post('/api/push/session-started', async (req, res) => {
    const { sessionId, unitCode, room, title } = req.body || {};
    await broadcastPush({
      title: `Class Starting — ${unitCode || 'Session'}`,
      body: `${title || 'Your class'} is starting in Room ${room}. Scan the QR code to mark attendance.`,
      url: '/attendance',
      tag: `session-${sessionId}`,
    });
    res.json({ ok: true, notified: pushSubscriptions.size });
  });

  // --- Frontend: Vite (dev) or static (prod) — registered AFTER API routes ---
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
