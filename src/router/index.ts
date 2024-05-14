import BasePage from '@Src/components/common/base-page';
import ROUTES, { AppRoutes, PageRoute } from './routes';

export default class Router {
  #currentRoutePath: AppRoutes;

  #page!: BasePage;

  #list: PageRoute;

  static #instance: Router | null;

  private constructor() {
    this.#currentRoutePath = window.location.pathname.slice(1) as AppRoutes;
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
        this.route(window.location.pathname.slice(1) as AppRoutes, true);
      }
    });
  };

  route = (routePath = this.#currentRoutePath, needChangeHistory = true) => {
    this.#currentRoutePath = this.list().some((val) => val.routePath === routePath)
      ? routePath
      : AppRoutes.NOT_FOUND;

    const appRoute = this.#list[this.#currentRoutePath];

    if ('redirect' in appRoute) {
      this.route(appRoute.redirect);
    } else {
      const PageConstructor = this.#list[this.#currentRoutePath]?.pageConstructor;
      if (PageConstructor) {
        this.#page = new PageConstructor();
        this.#page.render();
      }
    }

    if (needChangeHistory) {
      window.history.pushState(this.#currentRoutePath, '', `${this.#currentRoutePath}`);
    }
  };

  static isRouteExist = (route: string) => !!ROUTES[route as AppRoutes];

  static isOwnUrl = (route: string) => route.search('http') < 0;

  // return list of routes
  list = () =>
    Object.entries(this.#list).map(([routePath, route]) => ({
      routePath,
      name: route.name,
      routeToPage: () => this.route(routePath as AppRoutes),
    }));

  refresh = () => {
    this.route(this.#currentRoutePath, false);
  };
}
