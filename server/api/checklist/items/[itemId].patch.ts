import { updateChecklistItemSchema } from "~~/shared/schemas/checklist";

import { createSessionClient } from "~~/server/lib/appwrite";
import { mapChecklistItem } from "~~/server/utils/mapChecklist";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const itemId = getRouterParam(event, "itemId");

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Item ID is required",
    });
  }

  const body = await readBody(event);

  const validation = updateChecklistItemSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage:
        validation.error.issues[0]?.message ?? "Invalid checklist item",
    });
  }

  const config = useRuntimeConfig(event);
  const { tablesDB } = createSessionClient(event);

  try {
    const existing = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistItemsTableId,
      rowId: itemId,
    });

    if (existing.ownerId !== user.$id) {
      throw new Error("Not found");
    }

    const row = await tablesDB.updateRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistItemsTableId,
      rowId: itemId,
      data: validation.data,
    });

    return mapChecklistItem(row);
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Checklist item not found",
    });
  }
});
