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

export async function fetchStoryDataWithoutExtraData(): Promise<any[]> {
  const session = getSession();
  try {
    const result = await session.run(
      "MATCH (storyData:StoryData) RETURN storyData.id AS id, storyData.title AS title, storyData.genre AS genre, storyData.themes AS themes, storyData.generated_by AS generated_by"
    );

    const storyDataList = result.records.map((record) => {
      // Convert Neo4j properties to StoryData object without main_scenes and main_characters
      return {
        id: record.get("id"),
        title: record.get("title"),
        genre: record.get("genre"),
        themes: record.get("themes"),
        generated_by: record.get("generated_by"),
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
if (typeof globalThis.storyDataCache === "undefined") {
  globalThis.storyDataCache = undefined;
}

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

// Use a global cache object for data without scenes and characters
declare global {
  var storyDataCacheWithoutExtraData: { data: any[]; expiry: number } | undefined;
}

// Initialize the global cache if it doesn't exist
if (typeof globalThis.storyDataCacheWithoutExtraData === "undefined") {
  globalThis.storyDataCacheWithoutExtraData = undefined;
}

export async function getAllStoryDataWithoutExtraData(): Promise<any[]> {
  const now = Date.now();

  // Check if global cache exists and is still valid
  if (
    globalThis.storyDataCacheWithoutExtraData &&
    globalThis.storyDataCacheWithoutExtraData.expiry > now
  ) {
    return globalThis.storyDataCacheWithoutExtraData.data;
  }

  try {
    const data = await fetchStoryDataWithoutExtraData();
    // Update global cache with new data and set expiry to 5 minutes
    globalThis.storyDataCacheWithoutExtraData = {
      data,
      expiry: now + 5 * 60 * 1000, // 5 minutes in milliseconds
    };
    return data;
  } catch (error) {
    console.error("Failed to retrieve story data without scenes and characters:", error);
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

// Function to reset both caches
export function resetStoryDataCache() {
  globalThis.storyDataCache = undefined;
  globalThis.storyDataCacheWithoutExtraData = undefined;
}