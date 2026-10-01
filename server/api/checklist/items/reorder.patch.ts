import { z } from "zod";
import { createSessionClient } from "~~/server/lib/appwrite";

const reorderItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      sortOrder: z.number().int(),
    }),
  ),
});

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const body = await readBody(event);

  const validation = reorderItemsSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid items order",
    });
  }

  const config = useRuntimeConfig(event);
  const { tablesDB } = createSessionClient(event);

  for (const item of validation.data.items) {
    const existing = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistItemsTableId,
      rowId: item.id,
    });

    if (existing.ownerId !== user.$id) {
      throw createError({
        statusCode: 404,
        statusMessage: "Checklist item not found",
      });
    }

    await tablesDB.updateRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistItemsTableId,
      rowId: item.id,
      data: { sortOrder: item.sortOrder },
    });
  }

  return { success: true };
});
