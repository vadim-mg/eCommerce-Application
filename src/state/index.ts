import Router from '@Src/router';

const AUTH_STATE = 'CJ_ecapp_2024';

type AuthState = {
  isLoggedIn: boolean;
};
export default class State {
  #isLoggedIn: boolean;

  static #instance: State | null;

  private constructor() {
    const { isLoggedIn } = JSON.parse(sessionStorage.getItem(AUTH_STATE) ?? '{}') as AuthState;
    this.#isLoggedIn = isLoggedIn ?? false;
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
    sessionStorage.setItem(
      AUTH_STATE,
      JSON.stringify({
        isLoggedIn: this.#isLoggedIn,
      }),
    );
    Router.getInstance().refresh();
  }
}
