interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const chatWithAssistant = async (message: string, history: Message[] = []): Promise<string> => {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history })
  });

  if (!res.ok) {
    throw new Error(`Chat request failed: ${res.status}`);
  }

  const data = await res.json();
  return data.text || "I'm sorry, I couldn't generate a response.";
};
