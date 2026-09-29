import { Account, Client, Storage, TablesDB } from "appwrite";

export const useAppwrite = () => {
  const config = useRuntimeConfig();

  const client = new Client();

  client
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId);

  const account = new Account(client);
  const tablesDB = new TablesDB(client);
  const storage = new Storage(client);

  return {
    client,
    account,
    tablesDB,
    storage,
  };
};
