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
    protected: false,
    visibility: RouteVisibility.onlyNotAuth,
  },
  [AppRoutes.LOGOUT]: {
    name: 'Logout',
    pageConstructor: null,
    redirect: AppRoutes.MAIN,
    protected: false,
    visibility: RouteVisibility.onlyAuth,
  },
  [AppRoutes.SIGNUP]: {
    name: 'Sign Up',
    pageConstructor: SignupPage,
    protected: false,
    visibility: RouteVisibility.onlyNotAuth,
  },
  [AppRoutes.MAIN]: {
    name: 'Main',
    pageConstructor: MainPage,
    protected: false,
    visibility: RouteVisibility.everyOne,
  },

  [AppRoutes.CATALOGUE]: {
    name: 'Catalogue',
    pageConstructor: CataloguePage,
    protected: false,
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.ABOUT]: {
    name: 'About',
    pageConstructor: AboutPage,
    protected: false,
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.PROFILE]: {
    name: 'Profile',
    pageConstructor: ProfilePage,
    protected: true,
    visibility: RouteVisibility.onlyAuth,
  },
  [AppRoutes.CART]: {
    name: 'Cart',
    pageConstructor: CartPage,
    protected: false,
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.PRODUCT]: {
    name: 'product',
    pageConstructor: ProductPage,
    protected: false,
    visibility: RouteVisibility.everyOne,
  },

  [AppRoutes.NOT_FOUND]: {
    name: '404',
    pageConstructor: NotFound,
    protected: false,
    visibility: RouteVisibility.everyOne,
  },

  // only for development
  // todo: remove it in prod
  [AppRoutes.HIDDEN_EXAMPLE]: {
    name: 'HiddenExample',
    pageConstructor: BasePage,
    protected: false,
    visibility: RouteVisibility.everyOne,
  },
  [AppRoutes.HIDDEN_API]: {
    name: 'HiddenApi',
    pageConstructor: BasePage,
    protected: false,
    visibility: RouteVisibility.everyOne,
  },
};

if (process.env.NODE_ENV === 'development') {
  ROUTES.hiddenExample = {
    name: 'HiddenExample',
    pageConstructor: HiddenExamplePage,
    protected: false,
    visibility: RouteVisibility.everyOne,
  };
  ROUTES.hiddenApi = {
    name: 'HiddenApi',
    pageConstructor: HiddenApiPage,
    protected: false,
    visibility: RouteVisibility.everyOne,
  };
}

export type PageRoute = typeof ROUTES;

export default ROUTES;
