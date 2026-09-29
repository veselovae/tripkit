import { ID, Permission, Query, Role } from "node-appwrite";

import { createChecklistItemSchema } from "~~/shared/schemas/checklist";

import { createSessionClient } from "~~/server/lib/appwrite";
import { mapChecklistItem } from "~~/server/utils/mapChecklist";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const groupId = getRouterParam(event, "groupId");

  if (!groupId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Group ID is required",
    });
  }

  const config = useRuntimeConfig(event);
  const { tablesDB } = createSessionClient(event);

  let group;

  try {
    group = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistGroupsTableId,
      rowId: groupId,
    });
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Checklist group not found",
    });
  }

  if (group.ownerId !== user.$id) {
    throw createError({
      statusCode: 404,
      statusMessage: "Checklist group not found",
    });
  }

  const body = await readBody(event);

  const validation = createChecklistItemSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage:
        validation.error.issues[0]?.message ?? "Invalid checklist item",
    });
  }

  const existing = await tablesDB.listRows({
    databaseId: config.appwriteDatabaseId,
    tableId: config.appwriteChecklistItemsTableId,
    queries: [
      Query.equal("groupId", groupId),
      Query.orderDesc("sortOrder"),
      Query.limit(1),
    ],
  });

  const lastItem = existing.rows[0];

  const sortOrder = lastItem ? lastItem.sortOrder + 100 : 100;

  const row = await tablesDB.createRow({
    databaseId: config.appwriteDatabaseId,
    tableId: config.appwriteChecklistItemsTableId,
    rowId: ID.unique(),
    data: {
      ownerId: user.$id,
      tripId: group.tripId,
      groupId,
      title: validation.data.title,
      completed: false,
      note: validation.data.note,
      sortOrder,
    },
    permissions: [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ],
  });

  return mapChecklistItem(row);
});
