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

const ROUTES = {
  [AppRoutes.LOGIN]: {
    name: 'Login',
    pageConstructor: LoginPage,
    protected: false,
  },
  [AppRoutes.LOGOUT]: {
    name: 'Logout',
    pageConstructor: null,
    redirect: AppRoutes.MAIN,
    protected: false,
  },
  [AppRoutes.SIGNUP]: {
    name: 'Sign Up',
    pageConstructor: SignupPage,
    protected: false,
  },
  [AppRoutes.MAIN]: {
    name: 'Main',
    pageConstructor: MainPage,
    protected: false,
  },

  [AppRoutes.CATALOGUE]: {
    name: 'catalogue',
    pageConstructor: CataloguePage,
    protected: false,
  },
  [AppRoutes.ABOUT]: {
    name: 'about',
    pageConstructor: AboutPage,
    protected: false,
  },
  [AppRoutes.PROFILE]: {
    name: 'profile',
    pageConstructor: ProfilePage,
    protected: true,
  },
  [AppRoutes.CART]: {
    name: 'cart',
    pageConstructor: CartPage,
    protected: false,
  },
  [AppRoutes.PRODUCT]: {
    name: 'product',
    pageConstructor: ProductPage,
    protected: false,
  },

  [AppRoutes.NOT_FOUND]: {
    name: '404',
    pageConstructor: NotFound,
    protected: false,
  },

  // only for development
  // todo: remove it in prod
  [AppRoutes.HIDDEN_EXAMPLE]: {
    name: 'HiddenExample',
    pageConstructor: BasePage,
    protected: false,
  },
  [AppRoutes.HIDDEN_API]: {
    name: 'HiddenApi',
    pageConstructor: BasePage,
    protected: false,
  },
};

if (process.env.NODE_ENV === 'development') {
  ROUTES.hiddenExample = {
    name: 'HiddenExample',
    pageConstructor: HiddenExamplePage,
    protected: false,
  };
  ROUTES.hiddenApi = {
    name: 'HiddenApi',
    pageConstructor: HiddenApiPage,
    protected: false,
  };
}

export type PageRoute = typeof ROUTES;

export default ROUTES;
