import {
  createClient as baseCreateClient,
  type ClientConfig,
  type Route,
} from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "../slicemachine.config.json";
import routesJson from "./prismicio-routes.json" with { type: "json" };

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * A list of Route Resolver objects that define how a document's `url` field is resolved.
 *
 * {@link https://prismic.io/docs/route-resolver#route-resolver}
 */
const routes: Route[] = routesJson;

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: ClientConfig = {}) => {
  const client = baseCreateClient(repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
};

/**
 * Creates a Prismic client safe to use from Client Components (browser).
 *
 * Unlike {@link createClient}, this does NOT call `enableAutoPreviews`, whose
 * ref resolver dynamically imports `next/headers` on every query — a
 * server-only module that breaks when run in the browser. Previews aren't
 * relevant to client-side interactive queries, so this client only ever
 * reads published content.
 */
export const createBrowserClient = (config: ClientConfig = {}) => {
  return baseCreateClient(repositoryName, { routes, ...config });
};
