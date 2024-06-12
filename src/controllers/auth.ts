import {
  CartResourceIdentifier,
  CustomerSignin,
  MyCustomerDraft,
} from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import apiRoot from '@Src/api/api-root';
import customerApi from '@Src/api/customers';
import cartController from '@Src/controllers/cart';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import State from '@Src/state';
import errorHandler from './error-handler';

// read https://docs.commercetools.com/api/projects/customers#authenticate-sign-in-customer
// read https://docs.commercetools.com/api/projects/customers#create-sign-up-customer-in-store

// All catches must be in functions that call this functions

const signIn = async (customer: CustomerSignin) => {
  const customerWithCart = customer;
  const anonymousCart: CartResourceIdentifier = {
    typeId: 'cart',
    id: (await cartController.getCartData())?.id,
  };
  const anonymousCartSignInMode = 'MergeWithExistingCustomerCart';
  return customerApi
    .signIn({
      ...customerWithCart,
      anonymousCart,
      anonymousCartSignInMode,
      updateProductData: true,
      anonymousId: (await cartController.getCartData())?.anonymousId,
    })
    .then(async (response) => {
      if (response.statusCode === 200) {
        cartController.setCartData(response.body.cart ?? null);
        State.getInstance().isLoggedIn = true;
        State.getInstance().currentUser = response.body.customer;
        Router.getInstance().route(AppRoutes.MAIN);
      }
    })
    .catch((error: HttpErrorType) => {
      errorHandler(error as HttpErrorType);
      throw new Error(error.message);
    });
};

const signUp = (customer: MyCustomerDraft) =>
  customerApi
    .signUp(customer)
    .then(async (response) => {
      if (response.statusCode === 201) {
        const { email, password } = customer;
        const customerSignInResult = (await apiRoot.loginUser({ username: email, password })).body;
        cartController.setCartData(customerSignInResult.cart ?? null);
        State.getInstance().isLoggedIn = true;
        State.getInstance().currentUser = response.body.customer;
        // await cartController.getCartData(true);
        await cartController.setShippingAddressForCustomer(customerSignInResult);
        Router.getInstance().route(AppRoutes.MAIN);
      }
    })
    .catch((error) => {
      errorHandler(error as HttpErrorType);
      throw error;
    });

const signOut = async () => {
  apiRoot.logoutUser();
  State.getInstance().isLoggedIn = false;
  State.getInstance().currentUser = null;
  cartController.setCartData(null);
  cartController.getCartData();
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
