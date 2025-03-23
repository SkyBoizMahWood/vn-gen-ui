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

// Default export with empty array fallback
export default async function getAllStoryData(): Promise<any[]> {
  try {
    return await fetchStoryData();
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