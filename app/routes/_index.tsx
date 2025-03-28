import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { redirect, useLoaderData, useNavigation } from "@remix-run/react";
import StoryCard from "~/components/StoryCard";
import { getAllStoryDataWithoutExtraData } from "~/data/getStoryData";
import { getFirstStoryChunkId } from "~/db/stories";

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
  const stories = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const formData = navigation.formData;
  const loadingStoryId = formData?.get("storyId")?.toString();

  // Sort stories by generated_by
  stories.sort((a, b) => 
    a.generated_by > b.generated_by ? 1 : b.generated_by > a.generated_by ? -1 : 0
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header Section */}
      <header className="fixed left-0 right-0 top-0 z-10 bg-white shadow-md dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-center text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            (☞ﾟヮﾟ)☞ Auto VN Gen ☜(ﾟヮﾟ☜)
          </h1>
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
            />
          ))}
        </div>
      </main>
    </div>
  );
}
