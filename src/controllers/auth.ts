import { CustomerSignin, MyCustomerDraft } from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import apiRoot from '@Src/api/api-root';
import customerApi from '@Src/api/customers';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import State from '@Src/state';
import errorHandler from './error-handler';

// read https://docs.commercetools.com/api/projects/customers#authenticate-sign-in-customer
// read https://docs.commercetools.com/api/projects/customers#create-sign-up-customer-in-store

// All catches must be in functions that call this functions

const signIn = (customer: CustomerSignin) =>
  customerApi
    .signIn(customer)
    .then((response) => {
      if (response.statusCode === 200) {
        State.getInstance().isLoggedIn = true;
        State.getInstance().currentUser = response.body.customer;
        Router.getInstance().route(AppRoutes.MAIN);
      }
    })
    .catch((error: HttpErrorType) => {
      errorHandler(error as HttpErrorType);
      throw new Error(error.message);
    });

const signUp = (customer: MyCustomerDraft) =>
  customerApi
    .signUp(customer)
    .then((response) => {
      if (response.statusCode === 201) {
        const { email, password } = customer;
        apiRoot.loginUser({ username: email, password });
        State.getInstance().isLoggedIn = true;
        State.getInstance().currentUser = response.body.customer;
        Router.getInstance().route(AppRoutes.MAIN);
      }
    })
    .catch((error) => {
      errorHandler(error as HttpErrorType);
      throw error;
    });

const signOut = () => {
  apiRoot.logoutUser();
  State.getInstance().isLoggedIn = false;
  State.getInstance().currentUser = null;
  Router.getInstance().route(AppRoutes.LOGOUT);
};

const isEmailExist = (email: string) =>
  customerApi
    .returnCustomerByEmail(email)
    .then((result) => {
      if (result?.body.results.length === 1) {
        return true;
      }
      return false;
    })
    .catch((error) => {
      errorHandler(error as HttpErrorType);
      throw error;
    });

const me = () =>
  customerApi.me().catch((error) => {
    errorHandler(error as HttpErrorType);
    throw error;
  });

export default { signIn, signUp, signOut, isEmailExist, me };
