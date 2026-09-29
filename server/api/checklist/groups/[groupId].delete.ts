import { Query } from "node-appwrite";
import { createSessionClient } from "~~/server/lib/appwrite";

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

  try {
    const group = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistGroupsTableId,
      rowId: groupId,
    });

    if (group.ownerId !== user.$id) {
      throw new Error("Not found");
    }

    const items = await tablesDB.listRows({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistItemsTableId,
      queries: [Query.equal("groupId", groupId), Query.limit(500)],
    });

    await Promise.all(
      items.rows.map((item) =>
        tablesDB.deleteRow({
          databaseId: config.appwriteDatabaseId,
          tableId: config.appwriteChecklistItemsTableId,
          rowId: item.$id,
        }),
      ),
    );

    await tablesDB.deleteRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistGroupsTableId,
      rowId: groupId,
    });

    return { success: true };
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Checklist group not found",
    });
  }
});
