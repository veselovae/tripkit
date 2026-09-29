import { createSessionClient } from "~~/server/lib/appwrite";
import { requireUser } from "~~/server/utils/requireUser";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const tripId = getRouterParam(event, "id");

  if (!tripId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Trip ID is required",
    });
  }

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  try {
    const existing = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteTripsTableId,
      rowId: tripId,
    });

    if (existing.ownerId !== user.$id) {
      throw new Error("Not found");
    }

    await tablesDB.deleteRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteTripsTableId,
      rowId: tripId,
    });

    return {
      success: true,
    };
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Trip not found",
    });
  }
});
