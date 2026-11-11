import { User } from "@supabase/supabase-js";

/**
 * Registers a user in the custom `users` table after successful authentication.
 * Uses upsert to handle duplicate sign-ins gracefully.
 */
export async function registerUser(
  supabase: ReturnType<typeof import("../../lib/supabase/client").createSupabaseClient>,
  user: User
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from("users")
      .upsert(
        {
          user_id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
        },
        {
          onConflict: "user_id",
          ignoreDuplicates: true,
        }
      );

    if (error) {
      console.error("Failed to register user:", error);
      return { success: false, message: "Failed to save user profile. Please try again." };
    }

    return { success: true, message: "Welcome! Your profile has been created." };
  } catch (err) {
    console.error("Unexpected error during user registration:", err);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
