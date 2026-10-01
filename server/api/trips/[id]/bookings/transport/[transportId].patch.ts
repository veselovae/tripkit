import { updateTransportSchema } from "~~/shared/schemas/transport";

import { createSessionClient } from "~~/server/lib/appwrite";
import { mapTransport } from "~~/server/utils/mapTransport";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const transportId = getRouterParam(event, "transportId");

  if (!transportId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Transport ID is required",
    });
  }

  const body = await readBody(event);

  const validation = updateTransportSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage:
        validation.error.issues[0]?.message ?? "Invalid transport data",
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

    const row = await tablesDB.updateRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteTransportTableId,
      rowId: transportId,

      data: validation.data,
    });

    return mapTransport(row);
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Transport not found",
    });
  }
});
