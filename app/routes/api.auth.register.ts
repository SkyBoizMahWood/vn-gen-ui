import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { UserModel } from "~/models/user";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate input
    const errors = UserModel.validateUserData({ username, email, password });
    if (errors.length > 0) {
      return json({ errors }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return json({ error: "Email already exists" }, { status: 400 });
    }

    // Create new user
    const user = await UserModel.create({
      username,
      email,
      password,
      role: "user", // Default role is user
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}; 