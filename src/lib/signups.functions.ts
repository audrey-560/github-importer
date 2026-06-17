import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(200),
  golf_level: z.string().max(80).optional().default(""),
  interests: z.array(z.string().max(120)).max(20).default([]),
  availability: z.array(z.string().max(120)).max(20).default([]),
  instagram: z.string().max(120).nullable().optional(),
});

export const submitSignup = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SignupSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } }
    );

    const { error } = await supabase.from("signups").insert({
      name: data.name,
      email: data.email,
      golf_level: data.golf_level || null,
      interests: data.interests,
      availability: data.availability,
      instagram: data.instagram?.trim() || null,
    });

    if (error) {
      // 23505 = unique_violation; treat repeat email as success
      if (error.code === "23505") return { ok: true as const, duplicate: true };
      console.error("signup insert failed", error);
      throw new Error("signup_failed");
    }

    return { ok: true as const, duplicate: false };
  });
