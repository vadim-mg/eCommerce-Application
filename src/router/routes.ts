import BasePage from '@Src/components/common/base-page';
import HiddenApiPage from '@Src/pages/hidden-api';
import HiddenExamplePage from '@Src/pages/hidden-example';
import LoginPage from '@Src/pages/login';
import MainPage from '@Src/pages/main';
import RegistrationPage from '@Src/pages/registration';

const ROUTES = {
  login: {
    name: 'Login',
    pageConstructor: LoginPage,
    protected: false,
  },
  registration: {
    name: 'Register',
    pageConstructor: RegistrationPage,
    protected: false,
  },
  main: {
    name: 'Main',
    pageConstructor: MainPage,
    protected: false,
  },
  // only for development
  // todo: remove it in prod
  hiddenExample: {
    name: 'HiddenExample',
    pageConstructor: BasePage,
    protected: false,
  },
  hiddenApi: {
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
export type PageRouteKey = keyof PageRoute;

export default ROUTES;
