import { Account, Client, TablesDB } from "node-appwrite";
import type { H3Event } from "h3";

export const SESSION_COOKIE = "tripkit-session";

export const createAdminClient = (event?: H3Event) => {
  const config = useRuntimeConfig(event);

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId)
    .setKey(config.appwriteApiKey);

  return {
    account: new Account(client),
  };
};

export const createSessionClient = (event: H3Event) => {
  const config = useRuntimeConfig(event);

  const client = new Client()
    .setEndpoint(config.public.appwriteEndpoint)
    .setProject(config.public.appwriteProjectId);

  const session = getCookie(event, SESSION_COOKIE);

  if (session) {
    client.setSession(session);
  }

  return {
    account: new Account(client),
    tablesDB: new TablesDB(client),
  };
};
