import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUser } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  // Yêu cầu đăng nhập để xem truyện
  const user = await requireUser(request);
  const { storyId, chunkId } = params;
  
  // ... existing code to fetch story data ...
  
  return json({ user, storyData });
};

export default function GamePage() {
  const { user, storyData } = useLoaderData<typeof loader>();
  // ... rest of the code ...
} 