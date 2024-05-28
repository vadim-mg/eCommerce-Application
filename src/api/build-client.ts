import {
  AnonymousAuthMiddlewareOptions,
  ClientBuilder,
  PasswordAuthMiddlewareOptions,
  UserAuthOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { anonymousTokenCache, passwordTokenCache } from '@Src/utils/token-cache';

const hostAuth = process.env.CTP_AUTH_URL;
const hostAPI = process.env.CTP_API_URL;

const projectKey = process.env.CTP_PROJECT_KEY;

const credentials = {
  clientId: process.env.CTP_CLIENT_ID,
  clientSecret: process.env.CTP_CLIENT_SECRET,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: hostAPI,
  fetch,
};

const anonymousAuthMiddlewareOptions: AnonymousAuthMiddlewareOptions = {
  host: hostAuth,
  projectKey,
  credentials,
  scopes: [
    `view_published_products:${projectKey}`,
    `manage_my_orders:${projectKey}`,
    `manage_my_profile:${projectKey}`,
    `create_anonymous_token:${projectKey}`,
    `view_customers:${projectKey}`,
    `view_published_products:${projectKey}`,
    `view_categories:${projectKey}`,
  ],
  tokenCache: anonymousTokenCache,
};

const getPasswordAuthMiddlewareOptions = (
  user: UserAuthOptions,
): PasswordAuthMiddlewareOptions => ({
  host: hostAuth,
  projectKey,
  credentials: {
    ...credentials,
    user,
  },
  scopes: [
    `manage_my_business_units:${projectKey}`,
    `create_anonymous_token:${projectKey}`,
    `manage_my_shopping_lists:${projectKey}`,
    `view_tax_categories:${projectKey}`,
    `view_categories:${projectKey}`,
    `view_published_products:${projectKey}`,
    `view_discount_codes:${projectKey}`,
    `view_cart_discounts:${projectKey}`,
    `manage_my_payments:${projectKey}`,
    `view_shipping_methods:${projectKey}`,
    `manage_my_orders:${projectKey}`,
    `manage_my_quote_requests:${projectKey}`,
    `manage_my_profile:${projectKey}`,
    `manage_my_quotes:${projectKey}`,
    `view_types:${projectKey}`,
    `view_customers:${projectKey}`,
  ],
  tokenCache: passwordTokenCache,
});

// todo: in next sprint working with refresh tokens

// const refreshAnonymousAuthMiddlewareOptions = (refreshToken: string): RefreshAuthMiddlewareOptions => ({
//   host: hostAuth,
//   projectKey,
//   credentials: {
//     clientId: process.env.CTP_CLIENT_ID,
//     clientSecret: process.env.CTP_CLIENT_SECRET,
//   },
//   tokenCache: anonymousTokenCache,
//   refreshToken,
// });

// todo: in next sprints : not create anonymous token while user doesn't do something (put in cart for example)

// export const clientCtpClient = () =>
//   new ClientBuilder()
//     .withClientCredentialsFlow(clientAuthMiddlewareOptions)
//     .withHttpMiddleware(httpMiddlewareOptions)
//     .withLoggerMiddleware()
//     .build();

export const anonymousCtpClient = () => () =>
  new ClientBuilder()
    .withHttpMiddleware(httpMiddlewareOptions)
    // .withLoggerMiddleware()
    .withAnonymousSessionFlow(anonymousAuthMiddlewareOptions)
    .build();

export const passwordCtpClient = (user: UserAuthOptions) => () =>
  new ClientBuilder()
    .withHttpMiddleware(httpMiddlewareOptions)
    // .withLoggerMiddleware()
    .withPasswordFlow(getPasswordAuthMiddlewareOptions(user))
    .build();

export const existingTokenCtpClient = (token: string) => () =>
  new ClientBuilder()
    .withHttpMiddleware(httpMiddlewareOptions)
    // .withLoggerMiddleware()
    .withExistingTokenFlow(`Bearer ${token}`, { force: true })
    .build();
