import { ID, Permission, Query, Role } from "node-appwrite";

import { createTransportSchema } from "~~/shared/schemas/transport";

import { createSessionClient } from "~~/server/lib/appwrite";
import { mapTransport } from "~~/server/utils/mapTransport";

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

  const validation = createTransportSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage:
        validation.error.issues[0]?.message ?? "Invalid transport data",
    });
  }

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  const existing = await tablesDB.listRows({
    databaseId: config.appwriteDatabaseId,
    tableId: config.appwriteTransportTableId,
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
    tableId: config.appwriteTransportTableId,
    rowId: ID.unique(),
    data: {
      ownerId: user.$id,
      tripId,
      type: data.type,
      provider: data.provider,
      number: data.number,
      departureLocation: data.departureLocation,
      arrivalLocation: data.arrivalLocation,
      departureAt: data.departureAt,
      arrivalAt: data.arrivalAt,
      departureTerminal: data.departureTerminal,
      arrivalTerminal: data.arrivalTerminal,
      seat: data.seat,
      bookingReference: data.bookingReference,
      notes: data.notes,
      sortOrder,
    },
    permissions: [
      Permission.read(Role.user(user.$id)),
      Permission.update(Role.user(user.$id)),
      Permission.delete(Role.user(user.$id)),
    ],
  });

  return mapTransport(row);
});
