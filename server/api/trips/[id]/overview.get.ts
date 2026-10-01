import { Query } from "node-appwrite";

import { createSessionClient } from "~~/server/lib/appwrite";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const tripId = getRouterParam(event, "id");

  if (!tripId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Trip ID is required",
    });
  }

  const trip = await requireTrip(event, tripId);

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  const [checklistItemsResult, transportResult, accommodationResult] =
    await Promise.all([
      tablesDB.listRows({
        databaseId: config.appwriteDatabaseId,
        tableId: config.appwriteChecklistItemsTableId,
        queries: [
          Query.equal("tripId", tripId),
          Query.equal("ownerId", user.$id),
          Query.limit(500),
        ],
      }),

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

  const checklistItems = checklistItemsResult.rows;

  const totalChecklistItems = checklistItems.length;

  const completedChecklistItems = checklistItems.filter(
    (item) => item.completed,
  ).length;

  const checklistProgress =
    totalChecklistItems === 0
      ? 0
      : Math.round((completedChecklistItems / totalChecklistItems) * 100);

  const now = new Date();

  const nextTransportRow =
    transportResult.rows.find((row) => new Date(row.departureAt) >= now) ??
    transportResult.rows[0] ??
    null;

  const currentOrNextAccommodationRow =
    accommodationResult.rows.find((row) => new Date(row.checkOut) >= now) ??
    accommodationResult.rows[0] ??
    null;

  return {
    trip: mapTrip(trip),
    checklist: {
      total: totalChecklistItems,
      completed: completedChecklistItems,
      progress: checklistProgress,
    },
    nextTransport: nextTransportRow ? mapTransport(nextTransportRow) : null,
    accommodation: currentOrNextAccommodationRow
      ? mapAccommodation(currentOrNextAccommodationRow)
      : null,
  };
});
