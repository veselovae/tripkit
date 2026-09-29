import { ID, Permission, Role } from "node-appwrite";

import { createSessionClient } from "~~/server/lib/appwrite";
import { createTripSchema } from "~~/shared/schemas/trip";
import { requireUser } from "~~/server/utils/requireUser";
import { mapTrip } from "~~/server/utils/mapTrip";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const body = await readBody(event);

  const validation = createTripSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validation.error.issues[0]?.message ?? "Invalid trip data",
    });
  }

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  const data = validation.data;

  const row = await tablesDB.createRow({
    databaseId: config.appwriteDatabaseId,
    tableId: config.appwriteTripsTableId,

    rowId: ID.unique(),

    data: {
      ownerId: user.$id,

      title: data.title,
      destination: data.destination,

      startDate: data.startDate,
      endDate: data.endDate,

      description: data.description,

      coverFileId: null,
    },

    permissions: [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ],
  });

  return mapTrip(row);
});
