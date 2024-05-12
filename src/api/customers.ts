import { CustomerDraft } from "@commercetools/platform-sdk";
import apiRoot from "./api-root";

// https://docs.commercetools.com/sdk/sdk-example-code

const createCustomer = (customer: CustomerDraft) => apiRoot
  .customers()
  .post(
    {
      // The CustomerDraft is the object within the body
      body: customer
    })
  .execute();

export default createCustomer;
