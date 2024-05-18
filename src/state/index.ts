import { Customer } from '@commercetools/platform-sdk';
import Router from '@Src/router';

export default class State {
  #isLoggedIn: boolean;

  #currentUser: Customer | null;

  static #instance: State | null;

  private constructor() {
    this.#isLoggedIn = false;
    this.#currentUser = null;
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
    console.log(`Current state is: Is loggedIn: ${this.isLoggedIn}`);
    Router.getInstance().refresh();
  }

  set currentUser(user: Customer | null) {
    this.#currentUser = user;
  }

  get currentUser() {
    return this.#currentUser;
  }
}
