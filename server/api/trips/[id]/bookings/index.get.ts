import { Query } from "node-appwrite";
import { createSessionClient } from "~~/server/lib/appwrite";
import { mapAccommodation } from "~~/server/utils/mapAccommodation";
import { mapTransport } from "~~/server/utils/mapTransport";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const tripId = getRouterParam(event, "id");

  if (!tripId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Trip ID is required",
    });
  }

  await requireTrip(event, tripId);

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  const [transportResult, accommodationResult] = await Promise.all([
    tablesDB.listRows({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteTransportTableId,
      queries: [
        Query.equal("tripId", tripId),
        Query.equal("ownerId", user.$id),
        Query.orderAsc("departureAt"),
        Query.limit(100),
      ],
    }),

    tablesDB.listRows({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteAccommodationsTableId,
      queries: [
        Query.equal("tripId", tripId),
        Query.equal("ownerId", user.$id),
        Query.orderAsc("checkIn"),
        Query.limit(100),
      ],
    }),
  ]);

  return {
    transport: transportResult.rows.map(mapTransport),
    accommodations: accommodationResult.rows.map(mapAccommodation),
  };
});
