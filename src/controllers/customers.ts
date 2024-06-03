import { Customer as CustomerType, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import customerApi from '@Src/api/customers';

export default class Customer {
  #response!: CustomerType;

  updateCustomerData = async (
    currentVersion: number,
    updateActions: MyCustomerUpdateAction[],
    showSuccessNotification: () => void,
    showErrorNotification: () => void,
  ) => {
    try {
      const result = await customerApi.updateCustomerData(currentVersion, updateActions);
      this.#response = result.body;
      if (result.statusCode === 200) {
        showSuccessNotification();
      } else {
        showErrorNotification();
      }
    } catch (error) {
      console.error(error);
    }
    return this.#response;
  };
}
