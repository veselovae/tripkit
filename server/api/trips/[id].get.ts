import { createSessionClient } from "~~/server/lib/appwrite";
import { mapTrip } from "~~/server/utils/mapTrip";
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
    const row = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteTripsTableId,
      rowId: tripId,
    });

    if (row.ownerId !== user.$id) {
      throw createError({
        statusCode: 404,
        statusMessage: "Trip not found",
      });
    }

    return mapTrip(row);
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Trip not found",
    });
  }
});
