import { createSessionClient } from "~~/server/lib/appwrite";
import { updateTripSchema } from "~~/shared/schemas/trip";
import { mapTrip } from "~~/server/utils/mapTrip";
import { requireUser } from "~~/server/utils/requireUser";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const tripId = getRouterParam(event, "id");

  if (!tripId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Trip ID is required",
    });
  }

  const body = await readBody(event);

  const validation = updateTripSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: validation.error.issues[0]?.message ?? "Invalid trip data",
    });
  }

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  try {
    const existing = await tablesDB.getRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteTripsTableId,
      rowId: tripId,
    });

    if (existing.ownerId !== user.$id) {
      throw new Error("Not found");
    }

    const data = validation.data;

    const row = await tablesDB.updateRow({
      databaseId: config.appwriteDatabaseId,
      tableId: config.appwriteTripsTableId,
      rowId: tripId,

      data: {
        title: data.title,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
      },
    });

    return mapTrip(row);
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Trip not found",
    });
  }
});
