import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { UserAuthOptions } from '@commercetools/sdk-client-v2';
import State from '@Src/state';
import { anonymousTokenCache, passwordTokenCache } from '@Src/utils/token-cache';
import { anonymousCtpClient, existingTokenCtpClient, passwordCtpClient } from './build-client';

class ApiRoot {
  #currentCtpClient;

  constructor() {
    this.#currentCtpClient = State.getInstance().isLoggedIn
      ? existingTokenCtpClient(passwordTokenCache.get().token)
      : anonymousCtpClient();
  }

  get apiBuilder() {
    return createApiBuilderFromCtpClient(this.#currentCtpClient()).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY,
    });
  }

  loginUser = (user: UserAuthOptions) => {
    anonymousTokenCache.remove();
    this.#currentCtpClient = passwordCtpClient(user);
    this.apiBuilder
      .me()
      .login()
      .post({
        body: {
          email: user.username,
          password: user.password,
        },
      })
      .execute();
  };

  logoutUser() {
    passwordTokenCache.remove();
    this.#currentCtpClient = anonymousCtpClient();
  }
}

const apiRoot = new ApiRoot();

export default apiRoot;
