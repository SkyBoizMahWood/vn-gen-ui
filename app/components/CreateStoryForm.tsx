import { Form } from "@remix-run/react";
// import type { action } from "~/routes/story.new"; // Assuming action type can be imported - this line will be removed
import type { ActionResponse } from "~/routes/story.new"; // Import the exported type
import { useEffect, useRef } from "react";

interface CreateStoryFormProps {
  isSubmitting: boolean;
  // actionData?: ReturnType<typeof action extends (...args: any[]) => Promise<infer R> ? () => R : never>; - this line will be replaced
  actionData?: ActionResponse; // Use the imported type
  logs?: string[]; // Add this line
}

export default function CreateStoryForm({ isSubmitting, actionData, logs }: CreateStoryFormProps) {
  // Helper for consistent input styling
  const inputClassName = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none";
  const labelClassName = "block text-sm font-medium text-slate-700";

  // Ref for auto-scrolling logs
  const logsEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <Form method="post" className="space-y-6 max-w-2xl mx-auto bg-white p-8 shadow-xl rounded-lg">
      <div>
        <label htmlFor="game_genre" className={labelClassName}>Game Genre:</label>
        <input type="text" name="game_genre" id="game_genre" defaultValue="visual novel" className={inputClassName} />
      </div>

      <div>
        <label htmlFor="themes" className={labelClassName}>Themes (comma-separated):</label>
        <input type="text" name="themes" id="themes" placeholder="e.g., romance, mystery, sci-fi" className={inputClassName} />
        <p className="mt-1 text-xs text-slate-500">Leave blank for no specific themes.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="num_chapters" className={labelClassName}>Number of Chapters:</label>
          <input type="number" name="num_chapters" id="num_chapters" defaultValue="3" min="1" className={inputClassName} />
        </div>
        <div>
          <label htmlFor="num_endings" className={labelClassName}>Number of Endings:</label>
          <input type="number" name="num_endings" id="num_endings" defaultValue="3" min="1" className={inputClassName} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="num_main_characters" className={labelClassName}>Number of Main Characters:</label>
          <input type="number" name="num_main_characters" id="num_main_characters" defaultValue="5" min="1" className={inputClassName} />
        </div>
        <div>
          <label htmlFor="num_main_scenes" className={labelClassName}>Number of Main Scenes (Locations):</label>
          <input type="number" name="num_main_scenes" id="num_main_scenes" defaultValue="5" min="1" className={inputClassName} />
        </div>
      </div>
      
      <fieldset className="border p-4 rounded-md">
        <legend className="text-lg font-medium text-slate-800 px-2">Choice Configuration</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div>
                <label htmlFor="min_num_choices" className={labelClassName}>Min Choices per Opportunity:</label>
                <input type="number" name="min_num_choices" id="min_num_choices" defaultValue="2" min="1" className={inputClassName} />
            </div>
            <div>
                <label htmlFor="max_num_choices" className={labelClassName}>Max Choices per Opportunity:</label>
                <input type="number" name="max_num_choices" id="max_num_choices" defaultValue="3" min="1" className={inputClassName} />
            </div>
            <div>
                <label htmlFor="min_num_choices_opportunity" className={labelClassName}>Min Choice Opportunities per Chapter:</label>
                <input type="number" name="min_num_choices_opportunity" id="min_num_choices_opportunity" defaultValue="2" min="0" className={inputClassName} />
            </div>
            <div>
                <label htmlFor="max_num_choices_opportunity" className={labelClassName}>Max Choice Opportunities per Chapter:</label>
                <input type="number" name="max_num_choices_opportunity" id="max_num_choices_opportunity" defaultValue="3" min="0" className={inputClassName} />
            </div>
        </div>
      </fieldset>
      
      <div className="flex items-center">
        <input type="checkbox" name="enable_image_generation" id="enable_image_generation" className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" />
        <label htmlFor="enable_image_generation" className="ml-2 block text-sm text-slate-900">Enable Image Generation</label>
      </div>

      <div className="mt-6">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400"
        >
          {isSubmitting ? "Generating Story..." : "Generate Story"}
        </button>
      </div>
      {actionData && (
        <div className={`mt-4 p-4 rounded-md ${actionData.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <h3 className="font-bold">{actionData.success ? "Success!" : "Error!"}</h3>
          <p>
            {actionData.success
              ? `Story generation initiated. Story ID: ${actionData.data?.story_id}`
              : actionData.error
            }
          </p>
        </div>
      )}
      {logs && logs.length > 0 && (
        <div className="mt-4 bg-slate-100 p-2 rounded max-h-48 overflow-y-auto">
          <h4 className="font-bold text-xs mb-1">Logs</h4>
          <pre className="text-xs">{logs.join("\n")}</pre>
          <div ref={logsEndRef} />
        </div>
      )}
    </Form>
  );
} 