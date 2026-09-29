import { Query } from "node-appwrite";
import { createSessionClient } from "~~/server/lib/appwrite";
import { mapTrip } from "~~/server/utils/mapTrip";
import { requireUser } from "~~/server/utils/requireUser";

export default defineEventHandler(async (event) => {
  const user = requireUser(event);

  const config = useRuntimeConfig(event);

  const { tablesDB } = createSessionClient(event);

  const result = await tablesDB.listRows({
    databaseId: config.appwriteDatabaseId,
    tableId: config.appwriteTripsTableId,

    queries: [
      Query.equal("ownerId", user.$id),
      Query.orderAsc("startDate"),
      Query.limit(100),
    ],
  });

  return result.rows.map(mapTrip);
});
