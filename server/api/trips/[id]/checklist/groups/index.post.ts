import { ID, Permission, Query, Role } from "node-appwrite";

import { createChecklistGroupSchema } from "~~/shared/schemas/checklist";

import { createSessionClient } from "~~/server/lib/appwrite";
import { requireTrip } from "~~/server/utils/requireTrip";
import { mapChecklistGroup } from "~~/server/utils/mapChecklist";

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

  const body = await readBody(event);

  const validation = createChecklistGroupSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage:
        validation.error.issues[0]?.message ?? "Invalid group data",
    });
  }

  const config = useRuntimeConfig(event);
  const { tablesDB } = createSessionClient(event);

  const existing = await tablesDB.listRows({
    databaseId: config.appwriteDatabaseId,
    tableId: config.appwriteChecklistGroupsTableId,

    queries: [
      Query.equal("tripId", tripId),
      Query.orderDesc("sortOrder"),
      Query.limit(1),
    ],
  });

  const lastGroup = existing.rows[0];

  const sortOrder = lastGroup ? lastGroup.sortOrder + 100 : 100;

  const row = await tablesDB.createRow({
    databaseId: config.appwriteDatabaseId,
    tableId: config.appwriteChecklistGroupsTableId,
    rowId: ID.unique(),
    data: {
      ownerId: user.$id,
      tripId,
      title: validation.data.title,
      icon: validation.data.icon,
      sortOrder,
    },

    permissions: [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ],
  });

  return mapChecklistGroup(row);
});
