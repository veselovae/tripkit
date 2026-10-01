import { updateAccommodationSchema } from "~~/shared/schemas/accommodation";

import { createSessionClient } from "~~/server/lib/appwrite";
import { mapAccommodation } from "~~/server/utils/mapAccommodation";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const accommodationId = getRouterParam(event, "accommodationId");

  if (!accommodationId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Accommodation ID is required",
    });
  }

  const body = await readBody(event);

  const validation = updateAccommodationSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage:
        validation.error.issues[0]?.message ?? "Invalid accommodation data",
    });
  }

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  try {
    const existing = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteAccommodationsTableId,
      rowId: accommodationId,
    });

    if (existing.ownerId !== user.$id) {
      throw new Error("Not found");
    }

    const row = await tablesDB.updateRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteAccommodationsTableId,
      rowId: accommodationId,
      data: {
        ...validation.data,
        website: validation.data.website || null,
      },
    });

    return mapAccommodation(row);
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Accommodation not found",
    });
  }
});
