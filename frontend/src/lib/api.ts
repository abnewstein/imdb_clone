import { hc } from "hono/client";
import type { AuthRoute, ApiRoutes } from "@server/app";

const client = hc<ApiRoutes>("/", {
  headers: async () => {
    const accessToken = "your-access-token";

    return {
      authorization: `Bearer ${accessToken}`,
    };
  },
});
const authClient = hc<AuthRoute>("/");
export const api = client.api;
export const authApi = authClient.auth;
