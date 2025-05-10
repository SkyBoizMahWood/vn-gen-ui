import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import StoryCard from "~/components/StoryCard";
import { getAllStoryDataWithoutExtraData } from "~/data/getStoryData";
import { getFirstStoryChunkId } from "~/db/stories";
import BackgroundImage from "~/components/BackgroundImage";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Auto VG Gen" },
    { name: "description", content: "Created for Weebs" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const allStoryData = await getAllStoryDataWithoutExtraData();
  return allStoryData;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const storyId = formData.get("storyId");

  if (!storyId) {
    throw new Error("Story ID is required");
  }

  const firstChunkId = await getFirstStoryChunkId(storyId.toString());
  return redirect(`/game/${storyId}/${firstChunkId}`);
}

export default function Index() {
  const initialStories = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const formData = navigation.formData;
  const loadingStoryId = formData?.get("storyId")?.toString();

  const [stories, setStories] = useState(initialStories);

  useEffect(() => {
    setStories(initialStories);
  }, [initialStories]);

  const handleDelete = async (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    // Reset the cache in getStoryData via API route
    await fetch("/api/story/reset-cache", { method: "POST" });
  };

  stories.sort((a, b) =>
    a.generated_by > b.generated_by ? 1 : b.generated_by > a.generated_by ? -1 : 0
  );

  return (
    <BackgroundImage imageUrl="/images/background.jpg">
      {/* Header Section */}
      <header className="fixed left-0 right-0 top-0 z-10 bg-white/80 backdrop-blur-md shadow-md dark:bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-center text-3xl font-bold md:text-4xl
                           text-white
                           [text-shadow:_0_0_10px_rgba(99,102,241,0.5),
                                       _0_0_20px_rgba(99,102,241,0.3),
                                       _0_0_30px_rgba(99,102,241,0.2)]
                           animate-pulse">
              {["A", "u", "t", "o", " ", "V", "N", " ", "G", "e", "n"].map((letter, index) => (
                <span
                  key={index}
                  className="inline-block animate-[bounce_1s_ease-in-out_infinite]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
            </h1>
            <Link 
              to="/story/new"
              className="ml-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Story
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="mx-auto max-w-7xl px-4 pt-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              isLoading={navigation.state === "loading" && loadingStoryId === story.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </BackgroundImage>
  );
}
