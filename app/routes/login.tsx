import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import LoginForm from "~/components/LoginForm";
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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return json({ error: "Email và mật khẩu là bắt buộc" }, { status: 400 });
  }

  const user = await UserModel.findByEmail(email);
  if (!user) {
    return json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
  }

  const isValidPassword = await UserModel.verifyPassword(password, user.password);
  if (!isValidPassword) {
    return json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: true,
    redirectTo: "/",
  });
};

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  return <LoginForm />;
} 