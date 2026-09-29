import type { H3Event } from "h3";
import { createSessionClient } from "~~/server/lib/appwrite";

export const requireTrip = async (event: H3Event, tripId: string) => {
  const user = requireUser(event);

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  try {
    const trip = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteTripsTableId,
      rowId: tripId,
    });

    if (trip.ownerId !== user.$id) {
      throw new Error("Not found");
    }

    return trip;
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Trip not found",
    });
  }
};
