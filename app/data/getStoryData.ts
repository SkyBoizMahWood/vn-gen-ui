import { getSession } from "~/db/neo4j";
import { json, type LoaderFunctionArgs } from "@remix-run/node";

export async function fetchStoryData(): Promise<any[]> {
  const session = getSession();
  try {
    const result = await session.run(
      "MATCH (storyData:StoryData) RETURN storyData"
    );

    const storyDataList = result.records.map((record) => {
      const storyDataNode = record.get("storyData");
      const properties = storyDataNode.properties;

      // Convert Neo4j properties to StoryData object
      return {
        id: properties.id,
        title: properties.title,
        genre: properties.genre,
        themes: properties.themes,
        main_scenes: JSON.parse(properties.main_scenes),
        main_characters: JSON.parse(properties.main_characters),
        synopsis: properties.synopsis,
        chapter_synopses: JSON.parse(properties.chapter_synopses),
        beginning: properties.beginning,
        endings: JSON.parse(properties.endings),
        generated_by: properties.generated_by,
        approach: properties.approach,
      };
    });

    return storyDataList;
  } catch (error) {
    console.error("Error fetching story data:", error);
    return [];
  } finally {
    await session.close();
  }
}

// Use a global cache object
declare global {
  var storyDataCache: { data: any[]; expiry: number } | undefined;
}

// Initialize the global cache if it doesn't exist
globalThis.storyDataCache = globalThis.storyDataCache || null;

export default async function getAllStoryData(): Promise<any[]> {
  const now = Date.now();

  // Check if global cache exists and is still valid
  if (globalThis.storyDataCache && globalThis.storyDataCache.expiry > now) {
    return globalThis.storyDataCache.data;
  }

  try {
    const data = await fetchStoryData();
    // Update global cache with new data and set expiry to 5 minutes
    globalThis.storyDataCache = {
      data,
      expiry: now + 5 * 60 * 1000, // 5 minutes in milliseconds
    };
    return data;
  } catch (error) {
    console.error("Failed to retrieve story data:", error);
    return [];
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const allStoryData = await getAllStoryData();
  return json(allStoryData, {
    headers: {
      "Cache-Control": "public, max-age=300", // Cache trong 5 phút
    },
  });
};