import { User } from "@supabase/supabase-js";

/**
 * Registers a user in the custom `users` table after successful authentication.
 * Returns { isNew: true } only when a new row was inserted.
 * Returns { isNew: false } when the user already exists (no message should be shown).
 */
export async function registerUser(
  supabase: ReturnType<typeof import("../../lib/supabase/client").createSupabaseClient>,
  user: User
): Promise<{ success: boolean; message?: string; isNew: boolean }> {
  try {
    // Check if user already exists in the table
    const { data: existing } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      // User already exists — nothing to do, no message needed
      return { success: true, isNew: false };
    }

    // Insert new user
    const { error } = await supabase
      .from("users")
      .insert({
        user_id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
      });

    if (error) {
      // If the insert failed due to a duplicate key, the user already exists
      // (race condition: another request inserted them between our check and insert)
      if (error.code === "23505") {
        return { success: true, isNew: false };
      }
      console.error("Failed to register user:", error);
      return { success: false, message: "Failed to save user profile. Please try again.", isNew: false };
    }

    return { success: true, message: "Welcome! Your profile has been created.", isNew: true };
  } catch (err) {
    console.error("Unexpected error during user registration:", err);
    return { success: false, message: "An unexpected error occurred. Please try again.", isNew: false };
  }
}
