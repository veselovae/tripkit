import type { H3Event } from "h3";

export const requireUser = (event: H3Event) => {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  return user;
};
