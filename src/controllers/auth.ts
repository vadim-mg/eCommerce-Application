import { CustomerDraft, CustomerSignin } from "@commercetools/platform-sdk";
import customerApi from '@Src/api/customers';
import State from "@Src/state";

// read https://docs.commercetools.com/api/projects/customers#authenticate-sign-in-customer
// read https://docs.commercetools.com/api/projects/customers#create-sign-up-customer-in-store

const signIn = (customer: CustomerSignin) =>
  customerApi.signIn(customer)
    .then((response) => {
      if (response.statusCode === 200) {
        State.getInstance().isLoggedIn = true;
      }
    });

const signUp = (customer: CustomerDraft) =>
  customerApi.signUp(customer)
    .then(({ body }) => {
      console.log(`body.customer.id`);
      console.log(body.customer.id);
    });

const signOut = () => {
  State.getInstance().isLoggedIn = false;
};

export default { signIn, signUp, signOut };