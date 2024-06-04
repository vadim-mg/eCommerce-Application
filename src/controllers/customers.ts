import checkMarkSvg from '@Assets/icons/checkmark-white.svg';
import crossSvg from '@Assets/icons/cross-white.svg';
import {
  AuthErrorResponse,
  Customer,
  Customer as CustomerType,
  MyCustomerUpdateAction,
} from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import apiRoot from '@Src/api/api-root';
import customerApi from '@Src/api/customers';
import BaseElement from '@Src/components/common/base-element';
import classes from '@Src/pages/profile/style.module.scss';
import State from '@Src/state';
import auth from './auth';

export default class CustomerController {
  #response!: CustomerType;

  #notificationBlockWrapper!: BaseElement<HTMLDivElement>;

  createNotificationComponent = (isSuccessfull: boolean) => {
    const notificationTextElement = new BaseElement<HTMLParagraphElement>({
      tag: 'p',
      class: classes.notificationTextElement,
    });
    const notificationTextWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.notificationTextWrapper,
    });
    this.#notificationBlockWrapper = new BaseElement<HTMLDivElement>({ tag: 'div' });
    if (isSuccessfull) {
      notificationTextWrapper.node.innerHTML = checkMarkSvg;
      notificationTextElement.node.textContent = 'Data successfully updated.';
      this.#notificationBlockWrapper.node.classList.add(classes.notificationSuccessBlockWrapper);
    } else {
      notificationTextWrapper.node.innerHTML = crossSvg;
      notificationTextElement.node.textContent = 'Sorry, failed to update the data.';
      this.#notificationBlockWrapper.node.classList.add(classes.notificationErrorBlockWrapper);
    }
    notificationTextWrapper.node.append(notificationTextElement.node);
    this.#notificationBlockWrapper.node.append(notificationTextWrapper.node);
    document.body.append(this.#notificationBlockWrapper.node);

    setTimeout(() => {
      // this.#notificationBlockWrapper.node.classList.add(classes.hidden);
      this.#notificationBlockWrapper.node.remove();
    }, 3000);
  };

  errorNotification = () => {
    const notificationTextElement = new BaseElement<HTMLParagraphElement>({
      tag: 'p',
      class: classes.notificationTextElement,
      text: 'Sorry, failed to update the data.',
    });
    const notificationTextWrapper = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.notificationTextWrapper,
      innerHTML: crossSvg,
    });
    notificationTextWrapper.node.append(notificationTextElement.node);
    this.#notificationBlockWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.notificationErrorBlockWrapper },
      notificationTextWrapper,
    );
    document.body.append(this.#notificationBlockWrapper.node);

    setTimeout(() => {
      // this.#notificationBlockWrapper.node.classList.add(classes.hidden);
      this.#notificationBlockWrapper.node.remove();
    }, 3000);
  };

  updateCustomerData = async (updateActions: MyCustomerUpdateAction[]) => {
    try {
      const newVersion = State.getInstance().currentCustomerVersion;
      const result = await customerApi.updateCustomerData(newVersion, updateActions);
      this.#response = result.body;
      if (result.statusCode === 200) {
        State.getInstance().currentCustomerVersion = result.body.version;
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

  updatePassword = async (
    currentPassword: string,
    newPassword: string,
    onSuccessfulCb: (customer: Customer) => void,
    onErrorCb: (error: string) => void,
  ) => {
    try {
      const newVersion = State.getInstance().currentCustomerVersion;
      const result = await customerApi.updateCustomerPassword(
        newVersion,
        currentPassword,
        newPassword,
      );
      this.#response = result.body;
      if (result.statusCode === 200) {
        State.getInstance().currentCustomerVersion = result.body.version;

        // Re-authentication: Trigger re-authentication if needed, according to the authentication/authentication flow requirements for commercetools applications.
        apiRoot.logoutUser();
        apiRoot.loginUser({ username: result.body.email, password: newPassword });

        this.createNotificationComponent(true);
        onSuccessfulCb(this.#response);
      } else if (process.env.NODE_ENV === 'development') {
        console.log(result);
        console.log('Debug error with password updating');
      }
    } catch (error) {
      onErrorCb((error as AuthErrorResponse).message);
    }
    return this.#response;
  };

  static signIn = (email: string, password: string) => {
    auth
      .signIn({
        email,
        password,
      })
      .catch((error: HttpErrorType) => {
        console.log(error);
      });
  };
}
