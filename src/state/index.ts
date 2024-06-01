import { Customer } from '@commercetools/platform-sdk';
import Router from '@Src/router';
import { anonymousTokenCache, passwordTokenCache } from '@Src/utils/token-cache';

export default class State {
  #isLoggedIn: boolean;

  #currentUser: Customer | null;

  #currentCustomerVersion: number | null;

  static #instance: State | null;

  private constructor() {
    this.#isLoggedIn = !!passwordTokenCache.get().token;
    this.#currentUser = null;
    this.#currentCustomerVersion = null;
  }

  // State can be used in any part of App as a singleton
  static getInstance = () => {
    if (!State.#instance) {
      State.#instance = new State();
    }
    return State.#instance;
  };

  get isLoggedIn() {
    return this.#isLoggedIn;
  }

  set isLoggedIn(value: boolean) {
    this.#isLoggedIn = value;
    anonymousTokenCache.remove();
    Router.getInstance().refresh();
  }

  set currentUser(user: Customer | null) {
    this.#currentUser = user;
  }

  get currentUser() {
    return this.#currentUser;
  }

  set currentCustomerVersion(version: number | null) {
    this.#currentCustomerVersion = version;
  }

  get currentCustomerVersion() {
    return this.#currentCustomerVersion;
  }
}
