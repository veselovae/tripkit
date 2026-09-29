import { ID } from "node-appwrite";
import { registerSchema } from "~~/shared/schemas/auth";
import { createAdminClient, SESSION_COOKIE } from "~~/server/lib/appwrite";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const result = registerSchema.safeParse(body);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage:
        result.error.issues[0]?.message ?? "Invalid registration data",
    });
  }

  const { name, email, password } = result.data;

  const { account } = createAdminClient(event);

  try {
    await account.create({
      userId: ID.unique(),
      email,
      password,
      name,
    });

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
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error?.message ?? "Could not create account",
    });
  }
});
