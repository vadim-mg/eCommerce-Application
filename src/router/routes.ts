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
    pageConstructor: HiddenExamplePage,
    protected: false,
  },
};

export default ROUTES;
