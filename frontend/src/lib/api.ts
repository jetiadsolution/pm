const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

type FrontCard = { id: string; title: string; details: string };
type FrontColumn = { id: string; title: string; cardIds: string[] };

type FrontBoard = { columns: FrontColumn[]; cards: Record<string, FrontCard> };

export async function fetchBoard(): Promise<FrontBoard> {
  const res = await fetch(`${API_BASE}/api/board`, {
    method: "GET",
    credentials: "include",
    headers: { "Accept": "application/json" },
  });
  if (res.status === 401) {
    throw new Error("unauthenticated");
  }
  const data = await res.json();
  return toFrontBoard(data);
}

export async function saveBoard(frontBoard: FrontBoard): Promise<void> {
  const backend = toBackendBoard(frontBoard);
  await fetch(`${API_BASE}/api/board`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(backend),
  });
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.detail || "login failed");
  }
  return true;
}

export async function logout() {
  await fetch(`${API_BASE}/api/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function sendLLMResponse(payload: any) {
  const res = await fetch(`${API_BASE}/api/llm_response`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j.detail || "llm response failed");
  }
  return res.json();
}

function toBackendBoard(front: FrontBoard) {
  return {
    id: "default",
    columns: front.columns.map((col) => ({
      id: col.id,
      title: col.title,
      cards: col.cardIds.map((cid) => {
        const c = front.cards[cid];
        return { id: c.id, title: c.title, description: c.details };
      }),
    })),
  };
}

function toFrontBoard(backend: any): FrontBoard {
  const cards: Record<string, FrontCard> = {};
  const columns = (backend.columns || []).map((col: any) => {
    const cardIds: string[] = [];
    for (const c of col.cards || []) {
      cards[c.id] = { id: c.id, title: c.title || "", details: c.description || "" };
      cardIds.push(c.id);
    }
    return { id: col.id, title: col.title || "", cardIds };
  });
  return { columns, cards };
}
