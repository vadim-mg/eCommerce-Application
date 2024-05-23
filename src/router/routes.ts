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
  LOGIN = 'login',
  LOGOUT = 'logout',
  SIGNUP = 'signup',
  MAIN = 'main',
  CATALOGUE = 'catalogue',
  ABOUT = 'about',
  PROFILE = 'profile',
  CART = 'cart',
  PRODUCT = 'product',
  NOT_FOUND = '404',

  // hidden routes
  HIDDEN_EXAMPLE = 'hiddenExample',
  HIDDEN_API = 'hiddenApi',
}

// todo: i think about it :)

// type Route = {
//   name: string,
//   pageConstructor?: LoginPage | RegistrationPage | null,
//   redirect?: AppRoutes,
//   protected: boolean,
// };

// type Routes = {
//   [key in AppRoutes]: Route;
// };;

export enum RouteVisibility {
  everyOne,
  onlyAuth,
  onlyNotAuth,
}

const ROUTES = {
  [AppRoutes.LOGIN]: {
    name: 'Login',
    pageConstructor: LoginPage,
    visibility: RouteVisibility.onlyNotAuth,
  },
  [AppRoutes.LOGOUT]: {
    name: 'Logout',
    pageConstructor: null,
    redirect: AppRoutes.MAIN,
    visibility: RouteVisibility.onlyAuth,
  },
  [AppRoutes.SIGNUP]: {
    name: 'Sign Up',
    pageConstructor: SignupPage,
    visibility: RouteVisibility.onlyNotAuth,
  },
  [AppRoutes.MAIN]: {
    name: 'Main',
    pageConstructor: MainPage,
    visibility: RouteVisibility.everyOne,
  },

  [AppRoutes.CATALOGUE]: {
    name: 'Catalogue',
    pageConstructor: CataloguePage,
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.ABOUT]: {
    name: 'About',
    pageConstructor: AboutPage,
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.PROFILE]: {
    name: 'Profile',
    pageConstructor: ProfilePage,
    visibility: RouteVisibility.onlyAuth,
  },
  [AppRoutes.CART]: {
    name: 'Cart',
    pageConstructor: CartPage,
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.PRODUCT]: {
    name: 'product',
    pageConstructor: ProductPage,
    visibility: RouteVisibility.everyOne,
  },

  [AppRoutes.NOT_FOUND]: {
    name: '404',
    pageConstructor: NotFound,
    visibility: RouteVisibility.everyOne,
  },

  // only for development
  // todo: remove it in prod
  [AppRoutes.HIDDEN_EXAMPLE]: {
    name: 'HiddenExample',
    pageConstructor: BasePage,
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.HIDDEN_API]: {
    name: 'HiddenApi',
    pageConstructor: BasePage,
    visibility: RouteVisibility.everyOne,
  },
};

if (process.env.NODE_ENV === 'development') {
  ROUTES.hiddenExample = {
    name: 'HiddenExample',
    pageConstructor: HiddenExamplePage,
    visibility: RouteVisibility.everyOne,
  };
  ROUTES.hiddenApi = {
    name: 'HiddenApi',
    pageConstructor: HiddenApiPage,
    visibility: RouteVisibility.everyOne,
  };
}

export type PageRoute = typeof ROUTES;

export default ROUTES;
