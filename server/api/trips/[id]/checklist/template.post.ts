import { ID, Permission, Query, Role } from "node-appwrite";
import { createSessionClient } from "~~/server/lib/appwrite";
import { defaultChecklist } from "~~/shared/data/defaultChecklist";

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

  const existingGroups = await tablesDB.listRows({
    databaseId: config.appwriteDatabaseId,
    tableId: config.appwriteChecklistGroupsTableId,
    queries: [Query.equal("tripId", tripId), Query.limit(1)],
  });

  if (existingGroups.rows.length > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: "Checklist already contains groups",
    });
  }

  for (const [groupIndex, templateGroup] of defaultChecklist.entries()) {
    const group = await tablesDB.createRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistGroupsTableId,
      rowId: ID.unique(),
      data: {
        ownerId: user.$id,
        tripId,
        title: templateGroup.title,
        icon: templateGroup.icon,
        sortOrder: (groupIndex + 1) * 100,
      },

      permissions: [
        Permission.read(Role.user(user.$id)),
        Permission.update(Role.user(user.$id)),
        Permission.delete(Role.user(user.$id)),
      ],
    });

    for (const [itemIndex, title] of templateGroup.items.entries()) {
      await tablesDB.createRow({
        databaseId: config.appwriteDatabaseId,
        tableId: config.appwriteChecklistItemsTableId,
        rowId: ID.unique(),
        data: {
          ownerId: user.$id,
          tripId,
          groupId: group.$id,
          title,
          completed: false,
          note: "",
          sortOrder: (itemIndex + 1) * 100,
        },

        permissions: [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ],
      });
    }
  }

  return { success: true };
});
