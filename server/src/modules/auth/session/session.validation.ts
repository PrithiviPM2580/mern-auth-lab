import { Types } from "mongoose";
import { z } from "zod";

export const sessionParamsSchema = z.object({
  sessionId: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: "Invalid session ID",
  }),
});

export type SessionParams = z.infer<typeof sessionParamsSchema>;
