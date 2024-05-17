import { CustomerDraft, CustomerSignin } from '@commercetools/platform-sdk';
import apiRoot from './api-root';

// https://docs.commercetools.com/sdk/sdk-example-code
// https://docs.commercetools.com/api/projects/customers#authenticate-sign-in-customer

const signUp = (customer: CustomerDraft) =>
  apiRoot
    .customers()
    .post({
      body: customer,
    })
    .execute();

const signIn = (customer: CustomerSignin) =>
  apiRoot
    .login()
    .post({
      body: customer,
    })
    .execute();

// Search for Customers whose email address matches the Query Predicate
const returnCustomerByEmail = (email: string) =>
  apiRoot
    .customers()
    .get({
      queryArgs: {
        where: `email="${email}"`,
      },
    })
    .execute();

const me = () => apiRoot.me().get().execute();

export default { signIn, signUp, returnCustomerByEmail, me };
