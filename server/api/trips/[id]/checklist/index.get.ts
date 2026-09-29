import { Query } from "node-appwrite";

import { createSessionClient } from "~~/server/lib/appwrite";
import {
  mapChecklistGroup,
  mapChecklistItem,
} from "~~/server/utils/mapChecklist";
import { requireTrip } from "~~/server/utils/requireTrip";

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

  const [groupsResult, itemsResult] = await Promise.all([
    tablesDB.listRows({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistGroupsTableId,

      queries: [
        Query.equal("tripId", tripId),
        Query.equal("ownerId", user.$id),
        Query.orderAsc("sortOrder"),
        Query.limit(100),
      ],
    }),

    tablesDB.listRows({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistItemsTableId,

      queries: [
        Query.equal("tripId", tripId),
        Query.equal("ownerId", user.$id),
        Query.orderAsc("sortOrder"),
        Query.limit(500),
      ],
    }),
  ]);

  const groups = groupsResult.rows.map(mapChecklistGroup);

  const items = itemsResult.rows.map(mapChecklistItem);

  return groups.map((group) => ({
    ...group,
    items: items.filter((item) => item.groupId === group.id),
  }));
});
