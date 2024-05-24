import BasePage from '@Src/components/common/base-page';
import AboutPage from '@Src/pages/about';
import CartPage from '@Src/pages/cart';
import CataloguePage from '@Src/pages/catalogue';
import HiddenApiPage from '@Src/pages/hidden-api';
import HiddenExamplePage from '@Src/pages/hidden-example';
import LoginPage from '@Src/pages/login';
import MainPage from '@Src/pages/main';
import NotFound from '@Src/pages/not-found';
import ProductPage from '@Src/pages/product';
import ProfilePage from '@Src/pages/profile';
import SignupPage from '@Src/pages/signup';

export enum AppRoutes {
  LOGIN = '/login',
  LOGOUT = '/logout',
  SIGNUP = '/signup',
  MAIN = '/main',
  CATALOGUE = '/catalogue',
  ABOUT = '/about',
  PROFILE = '/profile',
  CART = '/cart',
  PRODUCT = '/product',
  NOT_FOUND = '/404',

  // hidden routes
  HIDDEN_EXAMPLE = '/hiddenExample',
  HIDDEN_API = '/hiddenApi',
}

type AvailablePage =
  | BasePage
  | AboutPage
  | CartPage
  | CataloguePage
  | HiddenApiPage
  | HiddenExamplePage
  | LoginPage
  | MainPage
  | NotFound
  | ProductPage
  | ProfilePage
  | SignupPage
  | null;

type Route = {
  name: string;
  page?: (args?: string[]) => AvailablePage | (() => AvailablePage);
  redirect?: AppRoutes;
  visibility: RouteVisibility;
};

type Routes = {
  [key in AppRoutes]: Route;
};

export enum RouteVisibility {
  everyOne,
  onlyAuth,
  onlyNotAuth,
}

const ROUTES: Routes = {
  [AppRoutes.LOGIN]: {
    name: 'Login',
    page: () => new LoginPage(),
    visibility: RouteVisibility.onlyNotAuth,
  },
  [AppRoutes.LOGOUT]: {
    name: 'Logout',
    page: () => null,
    redirect: AppRoutes.MAIN,
    visibility: RouteVisibility.onlyAuth,
  },
  [AppRoutes.SIGNUP]: {
    name: 'Sign Up',
    page: () => new SignupPage(),
    visibility: RouteVisibility.onlyNotAuth,
  },
  [AppRoutes.MAIN]: {
    name: 'Main',
    page: () => new MainPage(),
    visibility: RouteVisibility.everyOne,
  },

  [AppRoutes.CATALOGUE]: {
    name: 'Catalogue',
    page: () => new CataloguePage(),
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.ABOUT]: {
    name: 'About',
    page: () => new AboutPage(),
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.PROFILE]: {
    name: 'Profile',
    page: () => new ProfilePage(),
    visibility: RouteVisibility.onlyAuth,
  },
  [AppRoutes.CART]: {
    name: 'Cart',
    page: () => new CartPage(),
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.PRODUCT]: {
    name: 'product',
    page: (args?: string[]) => new ProductPage(args ?? []),
    visibility: RouteVisibility.everyOne,
  },

  [AppRoutes.NOT_FOUND]: {
    name: '404',
    page: () => new NotFound(),
    visibility: RouteVisibility.everyOne,
  },

  // only for development
  // todo: remove it in prod
  [AppRoutes.HIDDEN_EXAMPLE]: {
    name: 'HiddenExample',
    page: () => new BasePage(),
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.HIDDEN_API]: {
    name: 'HiddenApi',
    page: () => new BasePage(),
    visibility: RouteVisibility.everyOne,
  },
};

if (process.env.NODE_ENV === 'development') {
  ROUTES['/hiddenExample'] = {
    name: 'HiddenExample',
    page: () => new HiddenExamplePage(),
    visibility: RouteVisibility.everyOne,
  };
  ROUTES['/hiddenApi'] = {
    name: 'HiddenApi',
    page: () => new HiddenApiPage(),
    visibility: RouteVisibility.everyOne,
  };
}

export type PageRoute = typeof ROUTES;

export default ROUTES;
