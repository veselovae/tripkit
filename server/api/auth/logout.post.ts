import { createSessionClient, SESSION_COOKIE } from "~~/server/lib/appwrite";

export default defineEventHandler(async (event) => {
  const { account } = createSessionClient(event);

  try {
    await account.deleteSession({ sessionId: "current" });
  } catch {
    // Session could already be invalid.
  }

  deleteCookie(event, SESSION_COOKIE, { path: "/" });

  return { success: true };
});
