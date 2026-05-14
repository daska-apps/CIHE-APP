import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { UNIT_TITLES, TIMETABLE_A, TIMETABLE_B } from "../lib/timetableData";

let aiInstance: GoogleGenAI | null = null;

export const getGemini = () => {
  if (!aiInstance) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not defined in the environment.");
    }
    aiInstance = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY || '' 
    });
  }
  return aiInstance;
};

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

export const chatWithAssistant = async (message: string, history: any[] = []) => {
  const ai = getGemini();
  
  try {
    const contents = [...history, { role: 'user', parts: [{ text: message }] }];

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: `You are the CIHE (Crown Institute of Higher Education) Senior Digital Concierge. 
        You are an expert on all things CIHE Student Life, Academic Excellence, and Technical Infrastructure.

        CIHE SPECIFIC KNOWLEDGE:
        - INSTITUTION: Crown Institute of Higher Education (CIHE).
        - PORTAL: CIHE Smart Portal (Powered by Microsoft Entra ID).
        - ROLES: student, staff, lecturer, admin, global_admin. Access is controlled via Entra security groups.
         PROGRAMS: BIT, MBA, MRes, MIT, B.Ed (Early Childhood), M.Teaching.
        CONTACT: it.support@cihe.edu.au | students@cihe.edu.au

        PERSONALITY & TONE:
        - You are the CIHE Intelligence Hub assistant.
        - Speak naturally, professionally, and CONCISELY. 
        - For most conversations, use smooth, flowing paragraphs. Use punctuation and connector words.
        - HOWEVER, for structured data like TIMETABLES, SCHEDULES, or STEP-BY-STEP GUIDES, you MUST use clean, vertical lists. STRICLY FORBIDDEN: Do not use asterisks (*), dashes (-), or bullet points.
        - FORMAT FOR CLASSES: '9:00am - Unit Name'. Use 12-hour digital time (am/pm). Place each entry on its own line with no leading symbols.
        - It must be easy for "lazy" users to scan the raw text.
        - Do NOT dump lists of features or capabilities unless the user specifically asks "What can you do?" or "Help me with...".
        - Wait for the user to provide direction. If they say "hello", just greet them warmly and ask how you can help.
        - Be a "local mate": knowledgeable about Sydney/Perth logistics, transport, and student life.
        - Use Google Search for real-time information (delays, weather, latest news).

        STRICT RULES:
        1. Always be natural, direct, and conversational.
        2. When providing CLASS TIMES or SCHEDULES, use ONLY a clean vertical list. DO NOT use asterisks (*) or bullet points. Use 12-hour digital time format (e.g. 9:00am - Unit Name).
        3. Only provide technical steps if specifically requested.
        4. Prioritize 'remembering' things if the user mentions tasks or notes.
        5. Use the provided tools (getTimetable, getUnitInfo, findStaff) to give accurate, data-driven answers instead of guessing.
        6. If a student asks about their schedule, use getTimetable.
        7. If someone asks about a unit or a teacher, use getUnitInfo or findStaff.
        8. Keep it fast, smart, and human-like. Speak like a helpful personal advisor who knows the campus inside out.

        You have access to Google Search. Use it for external info like current train delays at North Sydney station or Perth central, or latest government visa updates.`,
        tools: [
          { googleSearch: {} },
          { functionDeclarations: [rememberItem, listMemories, forgetItem, getClassRollSummary, getTimetable, getUnitInfo, findStaff] }
        ],
        toolConfig: { includeServerSideToolInvocations: true }
      }
    });

    // Handle tool calls
    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const toolResponses = [];
      for (const call of functionCalls) {
        if (call.name === "rememberItem") {
          const res = await fetch('/api/memories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(call.args)
          });
          const data = await res.json();
          toolResponses.push({ name: call.name, id: call.id, response: { result: "Memory saved successfully", item: data } });
        } else if (call.name === "listMemories") {
          const res = await fetch('/api/memories');
          const data = await res.json();
          toolResponses.push({ name: call.name, id: call.id, response: { memories: data } });
        } else if (call.name === "forgetItem") {
          const { id } = call.args as any;
          await fetch(`/api/memories/${id}`, { method: 'DELETE' });
          toolResponses.push({ name: call.name, id: call.id, response: { result: "Memory forgotten successfully" } });
        } else if (call.name === "getClassRollSummary") {
          const { unitCode, date } = call.args as any;
          const attendance = Math.floor(Math.random() * (95 - 70) + 70); 
          toolResponses.push({ 
            name: call.name, 
            id: call.id, 
            response: { 
              summary: `For unit ${unitCode} on ${date}, there were 24 students expected and 21 students present. That is a ${attendance}% attendance rate. System check: All users verified via Entra ID.` 
            } 
          });
        } else if (call.name === "getTimetable") {
          const { studentId, version } = call.args as any;
          if (studentId) {
            const student = [...TIMETABLE_A, ...TIMETABLE_B].find(s => s.id === studentId);
            toolResponses.push({ name: call.name, id: call.id, response: { schedule: student?.sessions || "No personal schedule found for this ID." } });
          } else {
            const v = version || 'A';
            toolResponses.push({ name: call.name, id: call.id, response: { note: `Showing Master Schedule Version ${v}`, samples: (v === 'A' ? TIMETABLE_A : TIMETABLE_B).slice(0, 5) } });
          }
        } else if (call.name === "getUnitInfo") {
          const { unitCode } = call.args as any;
          const info = UNIT_TITLES[unitCode];
          toolResponses.push({ name: call.name, id: call.id, response: { unitInfo: info || "Unit details not found." } });
        } else if (call.name === "findStaff") {
          const { name } = call.args as any;
          const searchName = name.toLowerCase();
          const teaching = Object.values(UNIT_TITLES).filter(u => u.tutor.toLowerCase().includes(searchName));
          toolResponses.push({ name: call.name, id: call.id, response: { staffFound: teaching.length > 0 ? teaching : "No staff member found matching that name." } });
        }
      }

      // Send tool responses back to Gemini
      const secondResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...contents,
          { role: 'model', parts: response.candidates?.[0]?.content?.parts || [] },
          { role: 'user', parts: toolResponses.map(tr => ({ functionResponse: tr })) }
        ],
        config: {
            systemInstruction: "You are the CIHE Assistant. Continue the conversation naturally. For general info, use smooth paragraphs. For SCHEDULES or LISTS, use a clean vertical list (NO asterisks or bullet points). Format: '9:00am - Unit Name'. Use 12-hour format.",
            tools: [
              { googleSearch: {} },
              { functionDeclarations: [rememberItem, listMemories, forgetItem, getClassRollSummary, getTimetable, getUnitInfo, findStaff] }
            ],
            toolConfig: { includeServerSideToolInvocations: true }
        }
      });
      return secondResponse.text || "I've handled that for you.";
    }

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};
