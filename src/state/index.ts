import { Customer } from '@commercetools/platform-sdk';
import Router from '@Src/router';
import { anonymousTokenCache, passwordTokenCache } from '@Src/utils/token-cache';

export default class State {
  #isLoggedIn: boolean;

  #currentUser: Customer | null;

  #currentCustomerVersion: number | null;

  #storage: Map<string, string>;

  static #instance: State | null;

  private constructor() {
    this.#isLoggedIn = !!passwordTokenCache.get().token;
    this.#currentUser = null;
    this.#currentCustomerVersion = null;
    this.#storage = new Map();
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

  set currentCustomerVersion(version: number) {
    if (this.#currentCustomerVersion !== null && version < this.#currentCustomerVersion) {
      throw new Error('Current version is greater than provided version!');
    }
    this.#currentCustomerVersion = version;
  }

  get currentCustomerVersion(): number {
    if (this.#currentCustomerVersion === null) {
      throw new Error('Version is null');
    }
    return this.#currentCustomerVersion;
  }

  setItem = (key: string, value: string) => {
    this.#storage.set(key, value);
  };

  getItem = (key: string) => this.#storage.get(key);
}
