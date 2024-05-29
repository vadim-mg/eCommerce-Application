import { Customer as CustomerType, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import customerApi from '@Src/api/customers';

export default class Customer {
  #response!: CustomerType;

  constructor() {
    console.log('Customer constructor');
  }

  updateCustomerData = async (currentVersion: number, updateActions: MyCustomerUpdateAction[]) => {
    try {
      this.#response = (await customerApi.updateCustomerData(currentVersion, updateActions)).body;
    } catch (error) {
      console.error(error);
    }
    return this.#response;
  };
}
