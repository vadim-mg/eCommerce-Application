import { Customer as CustomerType, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import customerApi from '@Src/api/customers';
import State from '@Src/state';

export default class Customer {
  #response!: CustomerType;

  constructor() {
    console.log('Customer constructor');
  }

  updateCustomerData = async (updateActions: MyCustomerUpdateAction[]) => {
    try {
      const newVersion = State.getInstance().currentCustomerVersion;
      const result = await customerApi.updateCustomerData(newVersion, updateActions);
      this.#response = result.body;
      if (result.statusCode === 200) {
        console.log('Success');
        State.getInstance().currentCustomerVersion = result.body.version;
        if (process.env.NODE_ENV === 'development') {
          console.log(result);
        }
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error(error);
    }
    return this.#response;
  };

  updateSingleCustomerData = async (updateActions: MyCustomerUpdateAction) => this.updateCustomerData([updateActions]);
}
