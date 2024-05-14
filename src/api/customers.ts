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

export default { signIn, signUp };
