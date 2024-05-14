import Router from "@Src/router";

export default class State {
  #isLoggedIn: boolean;

  static #instance: State | null;

  private constructor() {
    this.#isLoggedIn = false;
    // todo save loggedState in session storage
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
    console.log(`Current state is: ${this.#isLoggedIn}`);
    Router.getInstance().refresh();
  }
}
