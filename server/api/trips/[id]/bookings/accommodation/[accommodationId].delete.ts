import { createSessionClient } from "~~/server/lib/appwrite";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const accommodationId = getRouterParam(event, "accommodationId");

  if (!accommodationId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Accommodation ID is required",
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

    await tablesDB.deleteRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteAccommodationsTableId,
      rowId: accommodationId,
    });

    return {
      success: true,
    };
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Accommodation not found",
    });
  }
});
