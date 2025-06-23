import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireAdmin } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  // Yêu cầu quyền admin để xem dashboard
  const user = await requireAdmin(request);
  return json({ user });
};

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user.username}!</p>
    </div>
  );
}
