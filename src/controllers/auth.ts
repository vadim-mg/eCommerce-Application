import { CustomerDraft, CustomerSignin } from '@commercetools/platform-sdk';
import customerApi from '@Src/api/customers';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import State from '@Src/state';

// read https://docs.commercetools.com/api/projects/customers#authenticate-sign-in-customer
// read https://docs.commercetools.com/api/projects/customers#create-sign-up-customer-in-store

const signIn = (customer: CustomerSignin) =>
  customerApi.signIn(customer).then((response) => {
    if (response.statusCode === 200) {
      State.getInstance().isLoggedIn = true;
      Router.getInstance().route(AppRoutes.MAIN);
    }
  });

const signUp = (customer: CustomerDraft) =>
  customerApi.signUp(customer).then(({ body }) => {
    console.log(`body.customer.id`);
    console.log(body.customer.id);
    State.getInstance().isLoggedIn = true;
    Router.getInstance().route(AppRoutes.MAIN);
  });

const signOut = () => {
  State.getInstance().isLoggedIn = false;
  Router.getInstance().route(AppRoutes.LOGOUT);
};

export default { signIn, signUp, signOut };
