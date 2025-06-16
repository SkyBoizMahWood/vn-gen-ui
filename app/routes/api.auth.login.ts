import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { createUserSession } from "~/utils/session.server";
import { UserModel } from "~/models/user";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    if (!email || !password) {
      return json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await UserModel.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create session
    const { password: _, ...userWithoutPassword } = user;
    return createUserSession({
      request,
      userId: user.id,
      remember: true,
      redirectTo: "/",
    });
  } catch (error) {
    console.error("Login error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}; 