import { z } from "zod";
import { createSessionClient } from "~~/server/lib/appwrite";

const reorderGroupsSchema = z.object({
  groups: z.array(
    z.object({
      id: z.string().min(1),
      sortOrder: z.number().int(),
    }),
  ),
});

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const body = await readBody(event);

  const validation = reorderGroupsSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid groups order",
    });
  }

  const config = useRuntimeConfig(event);
  const { tablesDB } = createSessionClient(event);

  for (const group of validation.data.groups) {
    const existing = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistGroupsTableId,
      rowId: group.id,
    });

    if (existing.ownerId !== user.$id) {
      throw createError({
        statusCode: 404,
        statusMessage: "Checklist group not found",
      });
    }

    await tablesDB.updateRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistGroupsTableId,
      rowId: group.id,
      data: { sortOrder: group.sortOrder },
    });
  }

  return { success: true };
});
