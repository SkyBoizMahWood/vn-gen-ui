import { redirect } from "@remix-run/node";
import { UserModel } from "~/models/user";
import { getUserId, requireUserId } from "./session.server";

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);
  const user = await UserModel.findById(userId);
  if (!user) {
    throw redirect("/login");
  }
  return user;
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);
  if (user.role !== "admin") {
    throw redirect("/", {
      status: 403,
      statusText: "Forbidden",
    });
  }
  return user;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;
  return UserModel.findById(userId);
}

export async function isAdmin(request: Request) {
  const user = await getUser(request);
  return user?.role === "admin";
} 