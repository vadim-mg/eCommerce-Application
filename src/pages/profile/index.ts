import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import userProfileLogo from '@Assets/icons/profile-icon-dark.svg';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText from '@Src/components/ui/input-text';
import AddressForm from '@Src/components/logic/address-form';
import auth from '@Src/controllers/auth';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import Customer from '@Src/controllers/customers';
import crossSvg from '@Assets/icons/cross-white.svg';
import checkMarkSvg from '@Assets/icons/checkmark-white.svg';
import { MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { validateDateOfBirth, validateEmail, validateUserData } from '@Src/utils/helpers';
import classes from './style.module.scss';

const createTitleComponent = () => {
  const titleWrapper = new BaseElement<HTMLDivElement>(
    { tag: 'div', class: classes.titleWrapper },
    new BaseElement<HTMLDivElement>({
      tag: 'div',
      innerHTML: userProfileLogo,
    }),
    new BaseElement<HTMLHeadingElement>({
      tag: 'h1',
      class: classes.title,
      text: 'Your profile',
    }),
  );
  return titleWrapper;
};

export default class ProfilePage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #userDataWrapper!: BaseElement<HTMLDivElement>;

  #userDataDetailsWrapper!: BaseElement<HTMLDivElement>;

  #passwordInput!: InputText;

  #passwordInputRepeat!: InputText;

  #savePasswordButton!: Button;

  #emailInput!: InputText;

  #firstNameInput!: InputText;

  #lastNameInput!: InputText;

  #birthDateInput!: InputText;

  #editDetailsBtn!: Button;

  #saveDetailsBtn!: Button;

  #deliveryAddressesContainer!: BaseElement<HTMLDivElement>;

  #billingAddressesContainer!: BaseElement<HTMLDivElement>;

  #addAddressBtn!: Button;

  #currentVersion!: number;

  #notificationSuccessBlockWrapper!: BaseElement<HTMLDivElement>;

  #notificationErrorBlockWrapper!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'profile page' });
    this.#createContent();
    this.#showContent();

    this.#me();
  }

  #me = () => {
    auth
      .me()
      .then((info) => {
        const customer = info.body;
        this.#currentVersion = customer.version;
        this.#emailInput.value = customer.email ?? '';
        this.#firstNameInput.value = customer.firstName ?? '';
        this.#lastNameInput.value = customer.lastName ?? '';
        this.#birthDateInput.value = customer.dateOfBirth ?? '';

        customer.shippingAddressIds?.forEach((addressId: string) => {
          const shippingAddress = customer.addresses.find((value) => value.id === addressId);
          if (shippingAddress) {
            const addressForm = new AddressForm(
              {},
              'shipping',
              shippingAddress,
              customer.defaultShippingAddressId === addressId,
            );
            this.#deliveryAddressesContainer.node.append(addressForm.node);
          }
        });

        customer.billingAddressIds?.forEach((addressId: string) => {
          const billingAddress = customer.addresses.find((value) => value.id === addressId);
          if (billingAddress) {
            const addressForm = new AddressForm(
              {},
              'shipping',
              billingAddress,
              customer.defaultBillingAddressId === addressId,
            );
            this.#billingAddressesContainer.node.append(addressForm.node);
          }
        });
        console.log(info.body);
      })
      .catch((error: HttpErrorType) => {
        console.log(error.message);
      });
  };

  createSuccessNotification = () => {
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
    notificationTextWrapper.node.append(notificationTextElement.node);
    this.#notificationSuccessBlockWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.notificationSuccessBlockWrapper },
      notificationTextWrapper,
    );
    return this.#notificationSuccessBlockWrapper;
  };

  createErrorNotification = () => {
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
    this.#notificationErrorBlockWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.notificationErrorBlockWrapper },
      notificationTextWrapper,
    );
    return this.#notificationErrorBlockWrapper;
  };

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.profile,
      },
      createTitleComponent(),
      this.createUserDataComponent(),
      this.createDeliveryAddressBasicStructure(),
      this.createBillingAddressBasicStructure(),
    );
  };

  createUserDataComponent = () => {
    this.#userDataWrapper = new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.userDataWrapper,
      },
      this.createUserDataDetailsComponent(),
      this.createUserPasswordComponent(),
    );
    return this.#userDataWrapper;
  };

  toggleUserDetailsInputsState = (state: boolean) => {
    this.#emailInput.setDisabled(state);
    this.#firstNameInput.setDisabled(state);
    this.#lastNameInput.setDisabled(state);
    this.#birthDateInput.setDisabled(state);
  };

  setEditMode = () => {
    this.toggleUserDetailsInputsState(false);

    this.#birthDateInput.addDateInputType();

    this.#editDetailsBtn.hide();
    this.#saveDetailsBtn.show();
  };

  static isEmailFree = (
    email: string,
    onFreeCb: () => void,
    onErrorCb: (errMessage: string) => void,
  ) =>
    auth
      .isEmailExist(email)
      .then((exist) => {
        if (exist) {
          onErrorCb(`Email ${email} is already exist!`);
        } else {
          onFreeCb();
        }
      })
      .catch(onErrorCb);

  handlerOnClickBtnUserDetails = () => {
    this.#emailInput.validate();
    this.#firstNameInput.validate();
    this.#lastNameInput.validate();
    this.#birthDateInput.validate();
    if (
      this.#emailInput.isValid &&
      this.#firstNameInput.isValid &&
      this.#lastNameInput.isValid &&
      this.#birthDateInput.isValid
    ) {
      // todo: add a check to see if the email input value matches current user email
      ProfilePage.isEmailFree(
        this.#emailInput.value,
        this.setSavedMode,
        this.#emailInput.showError,
      );
    } else {
      console.log('invalid');
    }
  };

  setSavedMode = () => {
    const customerUpdatedPersonalData: MyCustomerUpdateAction[] = [
      {
        action: 'changeEmail',
        email: this.#emailInput.value,
      },
      {
        action: 'setFirstName',
        firstName: this.#firstNameInput.value,
      },
      {
        action: 'setLastName',
        lastName: this.#lastNameInput.value,
      },
      {
        action: 'setDateOfBirth',
        dateOfBirth: this.#birthDateInput.value,
      },
    ];
    const response = new Customer().updateCustomerData(
      this.#currentVersion,
      customerUpdatedPersonalData,
    );

    console.log(response);

    this.toggleUserDetailsInputsState(true);

    this.#birthDateInput.addTextInputType();

    this.#editDetailsBtn.show();
    this.#saveDetailsBtn.hide();

    this.#notificationSuccessBlockWrapper.node.hidden = false;
    setTimeout(() => {
      this.#notificationSuccessBlockWrapper.node.hidden = true;
    }, 3000);
  };

  createUserDataDetailsComponent = () => {
    this.#userDataDetailsWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.userDataDetailsWrapper },
      new BaseElement<HTMLHeadingElement>({
        tag: 'h2',
        text: 'Personal details',
      }),
      (this.#emailInput = new InputText({ name: 'email', type: 'email' }, 'E-mail', () =>
        validateEmail(this.#emailInput.value),
      )),
      (this.#firstNameInput = new InputText({ name: 'firstName' }, 'Fist name', () =>
        validateUserData(this.#firstNameInput.value),
      )),
      (this.#lastNameInput = new InputText({ name: 'lastName' }, 'Last name', () =>
        validateUserData(this.#lastNameInput.value),
      )),
      (this.#birthDateInput = new InputText({ name: 'date-of-birth' }, 'Birth date', () =>
        validateDateOfBirth(this.#birthDateInput.value),
      )),
      this.createSuccessNotification(),
      this.createErrorNotification(),
      (this.#editDetailsBtn = new Button(
        { text: 'Edit details', class: classes.btnLineHeight },
        ButtonClasses.NORMAL,
        this.setEditMode,
      )),
      (this.#saveDetailsBtn = new Button(
        { text: 'Save', class: classes.btnLineHeight },
        ButtonClasses.NORMAL,
        this.handlerOnClickBtnUserDetails,
      )),
    );
    this.#notificationErrorBlockWrapper.node.hidden = true;
    this.#notificationSuccessBlockWrapper.node.hidden = true;

    this.#birthDateInput.node.classList.add(classes.birthDateInput);

    this.toggleUserDetailsInputsState(true);
    this.#saveDetailsBtn.hide();

    return this.#userDataDetailsWrapper;
  };

  createUserPasswordComponent = () => {
    const userPasswordWrapper = new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.userPasswordWrapper,
      },
      new BaseElement<HTMLHeadingElement>({ tag: 'h2', text: 'Change password' }),
      (this.#passwordInput = new InputText(
        { name: 'password', maxLength: 20, minLength: 8, type: 'password' },
        'New password',
      )),
      (this.#passwordInputRepeat = new InputText(
        { name: 'password', maxLength: 20, minLength: 8, type: 'password' },
        'Repeat password',
      )),
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.passwordRule,
        text: '! The password must be at least 8 characters long. It must contain Latin letters, at least one digit and at least one capital letter.',
      }),
      (this.#savePasswordButton = new Button(
        { text: 'Save password', class: classes.button },
        ButtonClasses.NORMAL,
        () => console.log('Save password'),
      )),
    );
    this.#passwordInput.node.classList.add(classes.inputMargin);
    this.#passwordInputRepeat.node.classList.add(classes.inputMargin);
    this.#savePasswordButton.node.classList.add(classes.btnLineHeight);
    return userPasswordWrapper;
  };

  createDeliveryAddressBasicStructure = () => {
    const deliveryAddressTitle = new BaseElement<HTMLHeadingElement>({
      tag: 'h2',
      text: 'Delivery address',
    });
    this.#addAddressBtn = this.createAddAddressBtn();
    this.#deliveryAddressesContainer = new BaseElement<HTMLDivElement>({ tag: 'div' });
    this.#deliveryAddressesContainer.node.append(deliveryAddressTitle.node);
    this.#deliveryAddressesContainer.node.append(this.#addAddressBtn.node);
    return this.#deliveryAddressesContainer;
  };

  createBillingAddressBasicStructure = () => {
    const billingAddressTitle = new BaseElement<HTMLHeadingElement>({
      tag: 'h2',
      text: 'Billing address',
    });
    this.#addAddressBtn = this.createAddAddressBtn();
    this.#billingAddressesContainer = new BaseElement<HTMLDivElement>({ tag: 'div' });
    this.#billingAddressesContainer.node.append(billingAddressTitle.node);
    this.#billingAddressesContainer.node.append(this.#addAddressBtn.node);
    return this.#billingAddressesContainer;
  };

  createAddAddressBtn = () => {
    this.#addAddressBtn = new Button(
      { text: '+Add address', class: classes.button },
      ButtonClasses.NORMAL,
      () => console.log('Add address'),
    );
    this.#addAddressBtn.node.classList.add(classes.addAddressBtn);
    return this.#addAddressBtn;
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
