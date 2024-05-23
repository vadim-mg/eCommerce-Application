import BasePage from '@Src/components/common/base-page';
import auth from '@Src/controllers/auth';
import State from '@Src/state';
import ROUTES, { AppRoutes, PageRoute, RouteVisibility } from './routes';

export default class Router {
  #currentRoutePath: AppRoutes;

  #page!: BasePage;

  #list: PageRoute;

  static #instance: Router | null;

  private constructor() {
    this.#currentRoutePath = window.location.pathname as AppRoutes;
    this.#list = ROUTES;
    this.addPopStateEventListener();
    window.history.replaceState({}, '', document.location.href);
  }

  // Router can be used in any part of App as a singleton
  static getInstance = () => {
    if (!Router.#instance) {
      Router.#instance = new Router();
    }
    return Router.#instance;
  };

  static isCurrentPath = (path: AppRoutes) => Router.getInstance().#currentRoutePath === path;

  addPopStateEventListener = () => {
    window.addEventListener('popstate', (event) => {
      if (event.state) {
        this.route(window.location.pathname as AppRoutes, false);
      }
    });
  };

  route = (routePathParam = this.#currentRoutePath, needChangeHistory = true) => {
    const routePath = routePathParam.slice(1);
    // route without path redirect to main
    if (routePath.length === 0) {
      this.route(AppRoutes.MAIN);
      return;
    }
    const parsedRoutePath = routePath.split('/');

    const masterRoute = `/${parsedRoutePath[0]}` as AppRoutes;
    const routeParameters = parsedRoutePath.slice(1);

    this.#currentRoutePath = this.list().some((val) => val.routePath === masterRoute)
      ? masterRoute
      : AppRoutes.NOT_FOUND;

    const appRoute = this.#list[this.#currentRoutePath];

    // logout can be used only one time for logged user
    if (routePath === AppRoutes.LOGOUT && State.getInstance().isLoggedIn) {
      auth.signOut();
      return;
    }

    // login, signup should redirect to main #64
    if (
      'visibility' in appRoute &&
      appRoute.visibility === RouteVisibility.onlyNotAuth &&
      State.getInstance().isLoggedIn
    ) {
      this.route(AppRoutes.MAIN);
      return;
    }

    // protected pages for not signed-in users should redirect to login
    if (
      'visibility' in appRoute &&
      appRoute.visibility === RouteVisibility.onlyAuth &&
      !State.getInstance().isLoggedIn
    ) {
      this.route(AppRoutes.LOGIN);
      return;
    }

    if ('redirect' in appRoute) {
      this.route(appRoute.redirect);
      return;
    }
    const PageConstructor = this.#list[this.#currentRoutePath]?.pageConstructor;
    if (PageConstructor) {
      const isComplexRoute = routeParameters.length && PageConstructor.length;
      const isBrokenComplexRoute =
        (routeParameters.length && !PageConstructor.length) ||
        (!routeParameters.length && PageConstructor.length);
      if (isComplexRoute) {
        this.#page = PageConstructor(routeParameters) as BasePage;
      } else if (isBrokenComplexRoute && this.#list[AppRoutes.NOT_FOUND].pageConstructor) {
        this.#page = this.#list[AppRoutes.NOT_FOUND].pageConstructor() as BasePage;
      } else {
        this.#page = PageConstructor() as BasePage;
      }
      this.#page.render();
    }

    if (needChangeHistory) {
      window.history.pushState({}, '', `${routePathParam as AppRoutes}`);
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
