import { CustomerSignin, MyCustomerDraft } from '@commercetools/platform-sdk';
import apiRoot from '@Src/api/api-root';
import customerApi from '@Src/api/customers';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import State from '@Src/state';

// read https://docs.commercetools.com/api/projects/customers#authenticate-sign-in-customer
// read https://docs.commercetools.com/api/projects/customers#create-sign-up-customer-in-store

// All catches must be in functions that call this functions

const signIn = (customer: CustomerSignin) =>
  customerApi.signIn(customer).then((response) => {
    if (response.statusCode === 200) {
      const { email, password } = customer;
      apiRoot.loginUser({ username: email, password });
      State.getInstance().isLoggedIn = true;
      State.getInstance().currentUser = response.body.customer;
      Router.getInstance().route(AppRoutes.MAIN);
    }
  });

const signUp = (customer: MyCustomerDraft) =>
  customerApi.signUp(customer).then((response) => {
    if (response.statusCode === 201) {
      const { email, password } = customer;
      apiRoot.loginUser({ username: email, password });
      State.getInstance().isLoggedIn = true;
      State.getInstance().currentUser = response.body.customer;
      Router.getInstance().route(AppRoutes.MAIN);
    }
  });

const signOut = () => {
  apiRoot.logoutUser();
  State.getInstance().isLoggedIn = false;
  State.getInstance().currentUser = null;
  Router.getInstance().route(AppRoutes.LOGOUT);
};

const isEmailExist = (email: string) =>
  customerApi.returnCustomerByEmail(email).then((result) => {
    if (result?.body.results.length === 1) {
      return true;
    }
    return false;
  });

const me = () => customerApi.me();

export default { signIn, signUp, signOut, isEmailExist, me };
