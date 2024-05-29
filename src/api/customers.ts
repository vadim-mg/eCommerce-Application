import {
  CustomerSignin,
  MyCustomerDraft,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';
import apiRoot from './api-root';

// https://docs.commercetools.com/sdk/sdk-example-code
// https://docs.commercetools.com/api/projects/customers#authenticate-sign-in-customer

const signUp = (customer: MyCustomerDraft) =>
  apiRoot.apiBuilder
    .me()
    .signup()
    .post({
      body: customer,
    })
    .execute();

const signIn = (customer: CustomerSignin) =>
  apiRoot.apiBuilder
    .me()
    .login()
    .post({
      body: customer,
    })
    .execute();

// Search for Customers whose email address matches the Query Predicate
const returnCustomerByEmail = (email: string) =>
  apiRoot.apiBuilder
    .customers()
    .get({
      queryArgs: {
        where: `email="${email}"`,
      },
    })
    .execute();

const me = () => apiRoot.apiBuilder.me().get().execute();

const updateCustomerData = (currentVersion: number, updateActions: MyCustomerUpdateAction[]) =>
  apiRoot.apiBuilder
    .me()
    .post({
      body: {
        version: currentVersion,
        actions: updateActions,
      },
    })
    .execute();

// const customRequest = () =>
//   apiRoot.apiBuilder.get({
//     headers: {
//       Authorization: 'Bearer xxx',
//     },
//   })
//     .execute();

export default { signIn, signUp, returnCustomerByEmail, me, updateCustomerData };
