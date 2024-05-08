import BasePage from '@Src/components/common/base-page';
import ROUTES from './routes';

type PageRoute = typeof ROUTES;
type PageRouteKey = keyof PageRoute;
export default class Router {
  #currentRoutePath: PageRouteKey;

  #page!: BasePage;

  #list: PageRoute;

  constructor() {
    this.#currentRoutePath = window.location.pathname.slice(1) as PageRouteKey;
    this.#list = ROUTES;
    this.addPopStateEventListener();
  }

  addPopStateEventListener = () => {
    window.addEventListener('popstate', () => {
      this.route(window.location.pathname.slice(1) as PageRouteKey, false);
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
      const pageName = `${this.#currentRoutePath} page`;
      window.history.pushState(null, pageName, `${this.#currentRoutePath}`);
      document.title = pageName;
    }
  };

  // return list of routes
  list = () =>
    Object.entries(this.#list).map(([routePath, route]) => ({
      routePath,
      name: route.name,
      routeToPage: () => this.route(routePath as PageRouteKey),
    }));
}
