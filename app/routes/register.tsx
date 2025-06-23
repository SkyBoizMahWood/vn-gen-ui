import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import RegisterForm from "~/components/RegisterForm";
import { createUserSession, getUserId } from "~/utils/session.server";
import { UserModel } from "~/models/user";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
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
    return json({ error: "Email đã tồn tại" }, { status: 400 });
  }

  // Create new user
  const user = await UserModel.create({
    username,
    email,
    password,
    role: "user", // Default role is user
  });

  return createUserSession({
    request,
    userId: user.id,
    remember: true,
    redirectTo: "/",
  });
};

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  return <RegisterForm />;
} 