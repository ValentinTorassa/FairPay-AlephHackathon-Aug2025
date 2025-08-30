import { BACKEND_BASE_URL } from "@/constants/config";

async function http(method: string, path: string, body?: any) {
  const res = await fetch(`${BACKEND_BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API ${method} ${path} failed: ${res.status}`);
  return res.json();
}

export const api = {
  startAutoUsage(sessionId: string) { return http("POST", "/usage/auto", { sessionId }); },
  stopAutoUsage(sessionId: string)  { return http("POST", "/usage/stop", { sessionId }); },
  randomUsage(sessionId: string)    { return http("POST", "/usage/random", { sessionId }); },
  manualUsage(sessionId: string, units: number) { return http("POST", "/usage/manual", { sessionId, units }); }
};
