import { createSessionClient } from "~~/server/lib/appwrite";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const itemId = getRouterParam(event, "itemId");

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Item ID is required",
    });
  }

  const config = useRuntimeConfig(event);
  const { tablesDB } = createSessionClient(event);

  try {
    const item = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistItemsTableId,
      rowId: itemId,
    });

    if (item.ownerId !== user.$id) {
      throw new Error("Not found");
    }

    await tablesDB.deleteRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistItemsTableId,
      rowId: itemId,
    });

    return { success: true };
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Checklist item not found",
    });
  }
});
