import type { ActionFunction } from "@remix-run/node";
import { logout } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  return logout(request);
}; 