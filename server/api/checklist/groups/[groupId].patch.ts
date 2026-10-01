import { updateChecklistGroupSchema } from "~~/shared/schemas/checklist";

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

  const body = await readBody(event);

  const validation = updateChecklistGroupSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage:
        validation.error.issues[0]?.message ?? "Invalid checklist group",
    });
  }

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  try {
    const existing = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistGroupsTableId,
      rowId: groupId,
    });

    if (existing.ownerId !== user.$id) {
      throw new Error("Not found");
    }

    const row = await tablesDB.updateRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteChecklistGroupsTableId,
      rowId: groupId,
      data: validation.data,
    });

    return mapChecklistGroup(row);
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Checklist group not found",
    });
  }
});
