import { ID, Permission, Query, Role } from "node-appwrite";

import { createAccommodationSchema } from "~~/shared/schemas/accommodation";

import { createSessionClient } from "~~/server/lib/appwrite";
import { mapAccommodation } from "~~/server/utils/mapAccommodation";

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

  const body = await readBody(event);

  const validation = createAccommodationSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage:
        validation.error.issues[0]?.message ?? "Invalid accommodation data",
    });
  }

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  const existing = await tablesDB.listRows({
    databaseId: config.appwriteDatabaseId,
    tableId: config.appwriteAccommodationsTableId,
    queries: [
      Query.equal("tripId", tripId),
      Query.orderDesc("sortOrder"),
      Query.limit(1),
    ],
  });

  const last = existing.rows[0];

  const sortOrder = last ? last.sortOrder + 100 : 100;

  const data = validation.data;

  const row = await tablesDB.createRow({
    databaseId: config.appwriteDatabaseId,
    tableId: config.appwriteAccommodationsTableId,
    rowId: ID.unique(),
    data: {
      ownerId: user.$id,
      tripId,
      type: data.type,
      name: data.name,
      address: data.address,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      bookingReference: data.bookingReference,
      phone: data.phone,
      website: data.website || null,
      notes: data.notes,
      sortOrder,
    },
    permissions: [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ],
  });

  return mapAccommodation(row);
});
