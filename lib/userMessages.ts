export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "That email or password did not match. Please try again.";
  }
  if (lower.includes("email not confirmed")) {
    return "Please confirm your email first, then sign in.";
  }
  if (lower.includes("user already registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (lower.includes("password")) {
    return "Please use a stronger password (at least 6 characters).";
  }
  return message;
}

export function friendlyDbError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("duplicate")) {
    return "This concert looks like a duplicate. Check your list.";
  }
  if (lower.includes("permission") || lower.includes("policy")) {
    return "You do not have permission to do that. Try signing in again.";
  }
  return "Something went wrong saving your concert. Please try again.";
}
