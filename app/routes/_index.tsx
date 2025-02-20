import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import LoadingSpinner from "~/components/LoadingSpinner";
import { getFirstStoryChunkId } from "~/db/stories";
import allStoryData from "~/data/storyData";

type Story = {
  id: string;
  title: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Auto VG Gen" },
    { name: "description", content: "Created for Weebs" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
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
  const isLoading = navigation.state === "loading";

  return (
    <div className="mx-auto h-screen w-screen text-slate-950 lg:w-4/5 lg:px-8 dark:text-slate-100">
      {/* Fixed header */}
      <div className="fixed left-0 right-0 top-0 z-10 bg-white py-4 dark:bg-slate-900">
        <h1 className="text-center text-3xl font-bold md:text-4xl">
          (☞ﾟヮﾟ)☞ Auto VN Gen ☜(ﾟヮﾟ☜)
        </h1>
      </div>

      {/* Scrollable content area */}
      <div className="h-full px-16 pt-24">
        <div className="flex h-full w-full flex-col items-center">
          <div className="w-full max-w-2xl space-y-4">
            {stories.map((story) => (
              <Form
                key={story.id}
                action="?index"
                method="POST"
                className="w-full"
              >
                <input type="hidden" name="storyId" value={story.id} />
                <button
                  className="w-full rounded border-2 border-indigo-500 px-4 py-2 text-center text-xl font-bold text-indigo-500 transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <LoadingSpinner
                      size="sm"
                      position="inline"
                      color="primary"
                    />
                  )}{" "}
                  {story.title}
                </button>
              </Form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
