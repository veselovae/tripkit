import { loginSchema } from "~~/shared/schemas/auth";
import { createAdminClient, SESSION_COOKIE } from "~~/server/lib/appwrite";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = loginSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.issues[0]?.message ?? "Invalid login data",
    });
  }

  const { email, password } = result.data;

  const { account } = createAdminClient(event);

  try {
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    setCookie(event, SESSION_COOKIE, session.secret, {
      expires: new Date(session.expire),
      path: "/",
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: "strict",
    });

    return { success: true };
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password",
    });
  }
});
