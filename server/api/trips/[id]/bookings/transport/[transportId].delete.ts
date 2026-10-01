import { createSessionClient } from "~~/server/lib/appwrite";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const transportId = getRouterParam(event, "transportId");

  if (!transportId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Transport ID is required",
    });
  }

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  try {
    const existing = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteTransportTableId,
      rowId: transportId,
    });

    if (existing.ownerId !== user.$id) {
      throw new Error("Not found");
    }

    await tablesDB.deleteRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteTransportTableId,
      rowId: transportId,
    });

    return { success: true };
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Transport not found",
    });
  }
});
