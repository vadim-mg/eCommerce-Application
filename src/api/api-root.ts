import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { Client, UserAuthOptions } from '@commercetools/sdk-client-v2';
import State from '@Src/state';
import { anonymousTokenCache, passwordTokenCache } from '@Src/utils/token-cache';
import {
  anonymousCtpClient,
  existingRefreshTokenCtpClient,
  existingTokenCtpClient,
  passwordCtpClient,
} from './build-client';

class ApiRoot {
  #currentCtpClient!: () => Client;

  constructor() {
    this.#defineCtpClient();
  }

  #defineCtpClient = () => {
    if (State.getInstance().isLoggedIn) {
      const ptc = passwordTokenCache.get();
      if (ptc.token) {
        this.#currentCtpClient = existingTokenCtpClient(ptc.token);
        return;
      }
      if (ptc.refreshToken) {
        this.#currentCtpClient = existingRefreshTokenCtpClient(passwordTokenCache);
        return;
      }
    }

    const atc = anonymousTokenCache.get();
    if (atc.token) {
      this.#currentCtpClient = existingTokenCtpClient(atc.token);
      return;
    }
    if (atc.refreshToken) {
      this.#currentCtpClient = existingRefreshTokenCtpClient(anonymousTokenCache);
      return;
    }

    this.#currentCtpClient = anonymousCtpClient();
  };

  get apiBuilder() {
    this.#defineCtpClient();
    return createApiBuilderFromCtpClient(this.#currentCtpClient()).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY,
    });
  }

  // when user login we need use passwordCtpClient
  apiBuilderForLogin = (user: UserAuthOptions) => {
    this.#currentCtpClient = passwordCtpClient(user);
    return createApiBuilderFromCtpClient(this.#currentCtpClient()).withProjectKey({
      projectKey: process.env.CTP_PROJECT_KEY,
    });
  };

  loginUser = (user: UserAuthOptions) => {
    anonymousTokenCache.remove();
    this.#currentCtpClient = passwordCtpClient(user);
    this.apiBuilderForLogin(user)
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
