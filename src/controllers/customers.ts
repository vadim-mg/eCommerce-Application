import { Customer as CustomerType, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import customerApi from '@Src/api/customers';
import BaseElement from '@Src/components/common/base-element';
import State from '@Src/state';
import checkMarkSvg from '@Assets/icons/checkmark-white.svg';
import crossSvg from '@Assets/icons/cross-white.svg';
import classes from '@Src/pages/profile/style.module.scss';

export default class CustomerController {
  #response!: CustomerType;

  #notificationBlockWrapper!: BaseElement<HTMLDivElement>;

  constructor() {
    console.log('Customer constructor');
  }

  createNotificationComponent = (isSuccessfull: boolean) => {
    const notificationTextElement = new BaseElement<HTMLParagraphElement>({
      tag: 'p',
      class: classes.notificationTextElement,
    });
    const notificationTextWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.notificationTextWrapper,
    });
    this.#notificationBlockWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div' },
    );
    if (!isSuccessfull) {
      notificationTextWrapper.node.innerHTML = crossSvg;
      notificationTextElement.node.textContent = 'Sorry, failed to update the data.';
      this.#notificationBlockWrapper.node.classList.add(classes.notificationErrorBlockWrapper);
    } else {
      notificationTextWrapper.node.innerHTML = checkMarkSvg;
      notificationTextElement.node.textContent = 'Data successfully updated.';
      this.#notificationBlockWrapper.node.classList.add(classes.notificationSuccessBlockWrapper);
    }
    notificationTextWrapper.node.append(notificationTextElement.node);
    this.#notificationBlockWrapper.node.append(notificationTextWrapper.node);
    document.body.append(this.#notificationBlockWrapper.node);

    setTimeout(() => {
      this.#notificationBlockWrapper.node.classList.add(classes.hidden);
    }, 3000);
  };

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
        this.createNotificationComponent(true);
      } else {
        this.createNotificationComponent(false);
      }
    } catch (error) {
      console.error(error);
    }
    return this.#response;
  };

  updateSingleCustomerData = async (updateActions: MyCustomerUpdateAction) =>
    this.updateCustomerData([updateActions]);

  updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const newVersion = State.getInstance().currentCustomerVersion;
      const result = await customerApi.updateCustomerPassword(newVersion, currentPassword, newPassword);
      this.#response = result.body;
      if (result.statusCode === 200) {
        State.getInstance().currentCustomerVersion = result.body.version;
        if (process.env.NODE_ENV === 'development') {
          console.log(result);
        }
        this.createNotificationComponent(true);
      } else {
        this.createNotificationComponent(false);
      }
    } catch (error) {
      console.error(error);
    }
    return this.#response;
  }
}
