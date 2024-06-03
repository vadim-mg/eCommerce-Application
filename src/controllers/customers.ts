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
      text: 'Data successfully updated.',
    });
    const notificationTextWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.notificationTextWrapper,
      innerHTML: checkMarkSvg,
    });
    if (!isSuccessfull) {
      notificationTextWrapper.node.innerHTML = crossSvg;
      notificationTextElement.node.textContent = 'Sorry, failed to update the data.';
      this.#notificationBlockWrapper.node.classList.add(classes.notificationErrorBlockWrapper);
    }
    notificationTextWrapper.node.append(notificationTextElement.node);
    this.#notificationBlockWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.notificationSuccessBlockWrapper },
      notificationTextWrapper,
    );
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
        console.log('error');
        this.createNotificationComponent(false);
      }
    } catch (error) {
      console.error(error);
    }
    return this.#response;
  };

  updateSingleCustomerData = async (updateActions: MyCustomerUpdateAction) =>
    this.updateCustomerData([updateActions]);
}
