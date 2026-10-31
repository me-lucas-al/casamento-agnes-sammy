import { z } from "zod";

const MAX_SUGGESTIONS_PER_REQUEST = 200;

export const addSuggestionsSchema = z.object({
  suggestionIds: z.array(z.string().trim().min(1).max(100)).min(1).max(MAX_SUGGESTIONS_PER_REQUEST),
});

export type AddSuggestionsInput = z.infer<typeof addSuggestionsSchema>;
