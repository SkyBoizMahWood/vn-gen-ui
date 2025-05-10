import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData, useNavigation } from "@remix-run/react";
import CreateStoryForm from "~/components/CreateStoryForm";
import { useState, useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Create New Visual Novel Story" },
    { name: "description", content: "Provide details to generate a new visual novel story." },
  ];
};

// Define a type for the expected API response
export interface ApiStoryResponse {
  message: string;
  story_id?: string;
  // Potentially other fields from the API response, e.g., details or error info
}

export interface ActionResponse {
  success: boolean;
  error?: string;
  data?: ApiStoryResponse;
}

const API_BASE_URL = process.env.AUTO_VN_GEN_API_URL || "http://localhost:8000";

export async function action({ request }: ActionFunctionArgs): Promise<Response> {
  const formData = await request.formData();

  const themesString = formData.get("themes") as string;
  const themes = themesString ? themesString.split(",").map(theme => theme.trim()).filter(Boolean) : null;

  const payload = {
    game_genre: formData.get("game_genre") || "visual novel",
    themes: themes,
    num_chapters: parseInt(formData.get("num_chapters") as string) || 3,
    num_endings: parseInt(formData.get("num_endings") as string) || 3,
    num_main_characters: parseInt(formData.get("num_main_characters") as string) || 5,
    num_main_scenes: parseInt(formData.get("num_main_scenes") as string) || 5,
    min_num_choices: parseInt(formData.get("min_num_choices") as string) || 2,
    max_num_choices: parseInt(formData.get("max_num_choices") as string) || 3,
    min_num_choices_opportunity: parseInt(formData.get("min_num_choices_opportunity") as string) || 2,
    max_num_choices_opportunity: parseInt(formData.get("max_num_choices_opportunity") as string) || 3,
    existing_plot: formData.get("existing_plot") || null,
    enable_image_generation: formData.get("enable_image_generation") === "on",
    seed: formData.get("seed") ? parseInt(formData.get("seed") as string) : null,
  };

  // Basic validation for number fields that might have been parsed as NaN
  const numericFields = [
    'num_chapters', 'num_endings', 'num_main_characters', 'num_main_scenes',
    'min_num_choices', 'max_num_choices', 'min_num_choices_opportunity', 'max_num_choices_opportunity'
  ];
  for (const field of numericFields) {
    if (isNaN(payload[field as keyof typeof payload] as number)) {
      return json<ActionResponse>({ success: false, error: `Invalid number provided for ${field}.` }, { status: 400 });
    }
  }
  if (payload.seed !== null && isNaN(payload.seed)) {
    return json<ActionResponse>({ success: false, error: "Invalid number provided for seed." }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/story/generate?approach=proposed`, { // Assuming 'proposed' approach by default
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Failed to call story generation API." }));
      console.error("API Error:", errorData);
      return json<ActionResponse>({ success: false, error: errorData.detail || `API Error: ${response.statusText}` }, { status: response.status });
    }

    const responseData: ApiStoryResponse = await response.json();
    
    // Optionally, redirect to a story page if story_id is returned
    // if (responseData.story_id) {
    //   return redirect(`/story/${responseData.story_id}`);
    // }

    return json<ActionResponse>({ success: true, data: responseData });

  } catch (error: any) {
    console.error("Network or other error:", error);
    return json<ActionResponse>({ success: false, error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}

export default function CreateStoryPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800">Create New Story</h1>
        <p className="text-lg text-slate-600">Fill in the details below to generate your visual novel.</p>
      </header>
      <CreateStoryForm isSubmitting={isSubmitting} actionData={actionData} />
    </div>
  );
} 