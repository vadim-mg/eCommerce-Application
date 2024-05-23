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

type Route = {
  name: string;
  pageConstructor?: (args?: string[]) => unknown | (() => unknown);
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
    pageConstructor: () => new LoginPage(),
    visibility: RouteVisibility.onlyNotAuth,
  },
  [AppRoutes.LOGOUT]: {
    name: 'Logout',
    pageConstructor: () => null,
    redirect: AppRoutes.MAIN,
    visibility: RouteVisibility.onlyAuth,
  },
  [AppRoutes.SIGNUP]: {
    name: 'Sign Up',
    pageConstructor: () => new SignupPage(),
    visibility: RouteVisibility.onlyNotAuth,
  },
  [AppRoutes.MAIN]: {
    name: 'Main',
    pageConstructor: () => new MainPage(),
    visibility: RouteVisibility.everyOne,
  },

  [AppRoutes.CATALOGUE]: {
    name: 'Catalogue',
    pageConstructor: () => new CataloguePage(),
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.ABOUT]: {
    name: 'About',
    pageConstructor: () => new AboutPage(),
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.PROFILE]: {
    name: 'Profile',
    pageConstructor: () => new ProfilePage(),
    visibility: RouteVisibility.onlyAuth,
  },
  [AppRoutes.CART]: {
    name: 'Cart',
    pageConstructor: () => new CartPage(),
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.PRODUCT]: {
    name: 'product',
    pageConstructor: (args?: string[]) => new ProductPage(args ?? []),
    visibility: RouteVisibility.everyOne,
  },

  [AppRoutes.NOT_FOUND]: {
    name: '404',
    pageConstructor: () => new NotFound(),
    visibility: RouteVisibility.everyOne,
  },

  // only for development
  // todo: remove it in prod
  [AppRoutes.HIDDEN_EXAMPLE]: {
    name: 'HiddenExample',
    pageConstructor: () => new BasePage(),
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.HIDDEN_API]: {
    name: 'HiddenApi',
    pageConstructor: () => new BasePage(),
    visibility: RouteVisibility.everyOne,
  },
};

if (process.env.NODE_ENV === 'development') {
  ROUTES['/hiddenExample'] = {
    name: 'HiddenExample',
    pageConstructor: () => new HiddenExamplePage(),
    visibility: RouteVisibility.everyOne,
  };
  ROUTES['/hiddenApi'] = {
    name: 'HiddenApi',
    pageConstructor: () => new HiddenApiPage(),
    visibility: RouteVisibility.everyOne,
  };
}

export type PageRoute = typeof ROUTES;

export default ROUTES;
