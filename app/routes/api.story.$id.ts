import { json } from "@remix-run/node";

const API_BASE_URL = process.env.AUTO_VN_GEN_API_URL || "http://localhost:8000";

export const action = async ({ params, request }: any) => {
  if (request.method !== "DELETE") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
  const { id } = params;
  const apiUrl = `${API_BASE_URL}/story/${id}`;

  const res = await fetch(apiUrl, { method: "DELETE" });
  if (!res.ok) {
    return json({ error: "Failed to delete story" }, { status: res.status });
  }
  return json({ success: true });
};

export const loader = async () => {
  return json({ error: "Method not allowed" }, { status: 405 });
}; 