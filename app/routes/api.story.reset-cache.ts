import { json } from "@remix-run/node";
import { resetStoryDataCache } from "~/data/getStoryData";

export const action = async () => {
  resetStoryDataCache();
  return json({ success: true });
};

export const loader = async () => {
  return json({ error: "Method not allowed" }, { status: 405 });
}; 