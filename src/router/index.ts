import BasePage from '@Src/components/common/base-page';
import ROUTES, { PageRoute, PageRouteKey } from './routes';

export default class Router {
  #currentRoutePath: PageRouteKey;

  #page!: BasePage;

  #list: PageRoute;

  static #instance: Router | null;

  private constructor() {
    this.#currentRoutePath = window.location.pathname.slice(1) as PageRouteKey;
    this.#list = ROUTES;
    this.addPopStateEventListener();
    window.history.replaceState(this.#currentRoutePath, '', document.location.href);
  }

  // Router can be used in any part of App as a singleton
  static getInstance = () => {
    if (!Router.#instance) {
      Router.#instance = new Router();
    }
    return Router.#instance;
  };

  static isCurrentPath = (path: string) => Router.getInstance().#currentRoutePath === path;

  addPopStateEventListener = () => {
    window.addEventListener('popstate', (event) => {
      if (event.state) {
        this.route(window.location.pathname.slice(1) as PageRouteKey, true);
      }
    });
  };

  route = (routePath = this.#currentRoutePath, needChangeHistory = true) => {
    this.#currentRoutePath = this.list().some((val) => val.routePath === routePath)
      ? routePath
      : 'main';

    const PageConstructor = this.#list[this.#currentRoutePath]?.pageConstructor;
    this.#page = new PageConstructor();
    this.#page.render();

    if (needChangeHistory) {
      window.history.pushState(this.#currentRoutePath, '', `${this.#currentRoutePath}`);
    }
  };

  static isRouteExist = (route: string) => !!ROUTES[route as PageRouteKey];

  // return list of routes
  list = () =>
    Object.entries(this.#list).map(([routePath, route]) => ({
      routePath,
      name: route.name,
      routeToPage: () => this.route(routePath as PageRouteKey),
    }));

  refresh = () => {
    this.route(this.#currentRoutePath, false);
  };
}
