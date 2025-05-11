import { LoaderFunctionArgs } from "@remix-run/node";

const API_BASE_URL = process.env.AUTO_VN_GEN_API_URL || "http://localhost:8000";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = await fetch(`${API_BASE_URL}/logs/stream`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": "text/event-stream",
    },
  });
}; 