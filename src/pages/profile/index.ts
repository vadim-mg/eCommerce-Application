import userProfileLogo from '@Assets/icons/profile-icon-dark.svg';
import { Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import AddressForm from '@Src/components/logic/address-form';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText from '@Src/components/ui/input-text';
import ModalWindow from '@Src/components/ui/modal';
import auth from '@Src/controllers/auth';
import CustomerController from '@Src/controllers/customers';
import State from '@Src/state';
import {
  validateDateOfBirth,
  validateEmail,
  validatePassword,
  validateUserData,
} from '@Src/utils/helpers';
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

const emptyAddress = {
  country: '',
  city: '',
  postalCode: '',
  streetName: '',
};

export default class ProfilePage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #userDataWrapper!: BaseElement<HTMLDivElement>;

  #cancelDetailsBtn!: Button;

  #userDataDetailsWrapper!: BaseElement<HTMLDivElement>;

  #passwordInput!: InputText;

  #currentUserPasswordInput!: InputText;

  #passwordInputRepeat!: InputText;

  #changePasswordButton!: Button;

  #savePasswordButton!: Button;

  #userPasswordWrapper!: BaseElement<HTMLFormElement>;

  #passwordBtnContainer!: BaseElement<HTMLDivElement>;

  #cancelPasswordButton!: Button;

  #emailInput!: InputText;

  #firstNameInput!: InputText;

  #lastNameInput!: InputText;

  #birthDateInput!: InputText;

  #editDetailsBtn!: Button;

  #saveDetailsBtn!: Button;

  #deliveryWrapper!: BaseElement<HTMLDivElement>;

  #billingWrapper!: BaseElement<HTMLDivElement>;

  #deliveryAddressesContainer!: BaseElement<HTMLDivElement>;

  #billingAddressesContainer!: BaseElement<HTMLDivElement>;

  #addAddressBtn!: Button;

  #currentEmail!: string;

  #modalForData!: ModalWindow;

  #passwordRules!: BaseElement<HTMLDivElement>;

  #customerController: CustomerController;

  #personalDataBtnBlock!: BaseElement<HTMLDivElement>;

  #errorText!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'profile page', showBreadCrumbs: true });
    this.#createContent();
    this.#showContent();
    this.#customerController = new CustomerController();
    this.#me();
  }

  initializeAddresses = (customer: Customer) => {
    this.#deliveryAddressesContainer.node.innerHTML = '';
    this.#billingAddressesContainer.node.innerHTML = '';
    customer.shippingAddressIds?.forEach((addressId: string) => {
      const shippingAddress = customer.addresses.find((value) => value.id === addressId);
      if (shippingAddress) {
        const addressForm = new AddressForm(
          {},
          'shipping',
          shippingAddress,
          customer.defaultShippingAddressId === addressId,
          addressId,
          this.initializeAddresses,
        );
        this.#deliveryAddressesContainer.node.append(addressForm.node);
      }
    });

    customer.billingAddressIds?.forEach((addressId: string) => {
      const billingAddress = customer.addresses.find((value) => value.id === addressId);
      if (billingAddress) {
        const addressForm = new AddressForm(
          {},
          'billing',
          billingAddress,
          customer.defaultBillingAddressId === addressId,
          addressId,
          this.initializeAddresses,
        );
        this.#billingAddressesContainer.node.append(addressForm.node);
      }
    });
  };

  #me = () => {
    auth
      .me()
      .then((info) => {
        const customer = info.body;

        State.getInstance().currentCustomerVersion = customer.version;
        this.#emailInput.value = customer.email ?? '';
        this.#firstNameInput.value = customer.firstName ?? '';
        this.#lastNameInput.value = customer.lastName ?? '';
        this.#birthDateInput.value = customer.dateOfBirth ?? '';

        this.initializeAddresses(customer);
        this.#currentEmail = customer.email;
      })
      .catch((error: HttpErrorType) => {
        console.log(error.message);
      });
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

  setSavedMode = async () => {
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
    await this.#customerController.updateCustomerData(customerUpdatedPersonalData);
    this.toggleUserDetailsInputsState(true);
    this.#birthDateInput.addTextInputType();
    this.setDefaultStateForPersonalBlock();
  };

  setDefaultStateForPersonalBlock = () => {
    this.#editDetailsBtn.node.classList.remove(classes.hidden);
    this.#saveDetailsBtn.node.classList.add(classes.hidden);
    this.#cancelDetailsBtn.node.classList.add(classes.hidden);
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
      this.createPersonalDataBtnBlock(),
    );
    this.#cancelDetailsBtn.node.classList.add(classes.hidden);
    this.#birthDateInput.node.classList.add(classes.birthDateInput);
    this.toggleUserDetailsInputsState(true);
    this.#saveDetailsBtn.node.classList.add(classes.hidden);

    return this.#userDataDetailsWrapper;
  };

  createPersonalDataBtnBlock = () => {
    this.#personalDataBtnBlock = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.personalDataBtnBlock },
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
      (this.#cancelDetailsBtn = new Button(
        { text: 'Cancel', class: classes.btnLineHeight },
        ButtonClasses.NORMAL,
        this.handlerOnClickBtnCancelDetails,
      )),
    );
    return this.#personalDataBtnBlock;
  };

  handlerOnClickBtnCancelDetails = () => {
    this.setDefaultStateForPersonalBlock();
  };

  setEditMode = () => {
    this.toggleUserDetailsInputsState(false);
    this.#birthDateInput.addDateInputType();
    this.#editDetailsBtn.node.classList.add(classes.hidden);
    this.#saveDetailsBtn.node.classList.remove(classes.hidden);
    this.#cancelDetailsBtn.node.classList.remove(classes.hidden);
  };

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
      if (this.#currentEmail !== this.#emailInput.value) {
        ProfilePage.isEmailFree(
          this.#emailInput.value,
          this.setSavedMode,
          this.#emailInput.showError,
        );
      } else {
        this.setSavedMode();
      }
    }
  };

  createUserPasswordComponent = () => {
    this.#userPasswordWrapper = new BaseElement<HTMLFormElement>(
      {
        tag: 'form',
        class: classes.userPasswordWrapper,
      },
      new BaseElement<HTMLHeadingElement>({ tag: 'h2', text: 'Change password' }),
      tag<HTMLInputElement>({
        tag: 'input',
        name: 'username',
        type: 'text',
        autocomplete: 'username',
        value: this.#currentEmail,
        hidden: true,
      }),
      (this.#currentUserPasswordInput = new InputText(
        { name: 'password', type: 'password', autocomplete: 'current-password' },
        'Current password',
      )),
      (this.#passwordInput = new InputText(
        {
          name: 'password',
          maxLength: 20,
          minLength: 8,
          type: 'password',
          autocomplete: 'new-password',
        },
        'New password',
        () => validatePassword(this.#passwordInput.value),
      )),
      (this.#passwordInputRepeat = new InputText(
        {
          name: 'password',
          maxLength: 20,
          minLength: 8,
          type: 'password',
          autocomplete: 'new-password',
        },
        'Repeat password',
        () => validatePassword(this.#passwordInputRepeat.value),
      )),
      (this.#passwordRules = new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.passwordRule,
        text: '! The password must be at least 8 characters long. It must contain at least one digit, at least one capital letter and at least one special character (!@#$%^&*).',
      })),
      (this.#errorText = new BaseElement<HTMLDivElement>({
        tag: 'div',
        text: 'Something was wrong!',
        class: classes.invalidPassword,
      })),
      this.createPasswordBtnContainer(),
    );
    this.hidePasswordElements();
    this.#errorText.node.classList.add(classes.hidden);
    this.togglePasswordInputsState(true);
    this.#savePasswordButton.node.classList.add(classes.hidden);
    this.#cancelPasswordButton.node.classList.add(classes.hidden);
    this.addLineHeightStyles();
    return this.#userPasswordWrapper;
  };

  togglePasswordInputsState = (state: boolean) => {
    this.#currentUserPasswordInput.setDisabled(state);
    this.#passwordInput.setDisabled(state);
    this.#passwordInputRepeat.setDisabled(state);
  };

  hidePasswordElements = () => {
    this.#currentUserPasswordInput.node.classList.add(classes.hidden);
    this.#passwordInput.node.classList.add(classes.hidden);
    this.#passwordInputRepeat.node.classList.add(classes.hidden);
    this.#passwordRules.node.classList.add(classes.hidden);
  };

  showPasswordElements = () => {
    this.#currentUserPasswordInput.node.classList.remove(classes.hidden);
    this.#passwordInput.node.classList.remove(classes.hidden);
    this.#passwordInputRepeat.node.classList.remove(classes.hidden);
    this.#passwordRules.node.classList.remove(classes.hidden);
  };

  addLineHeightStyles = () => {
    this.#changePasswordButton.node.classList.add(classes.btnLineHeight);
    this.#savePasswordButton.node.classList.add(classes.btnLineHeight);
    this.#cancelPasswordButton.node.classList.add(classes.btnLineHeight);
  };

  createPasswordBtnContainer = () => {
    this.#passwordBtnContainer = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.passwordBtnContainer },
      (this.#changePasswordButton = new Button(
        { text: 'Change password', class: classes.button },
        ButtonClasses.NORMAL,
        this.addChangePasswordClickHandler,
      )),
      (this.#savePasswordButton = new Button(
        { text: 'Save password', class: classes.button },
        ButtonClasses.NORMAL,
        this.addSavePasswordClickHandler,
      )),
      (this.#cancelPasswordButton = new Button(
        { text: 'Cancel', class: classes.button },
        ButtonClasses.NORMAL,
        this.addCancelPasswordClickHandler,
      )),
    );
    return this.#passwordBtnContainer;
  };

  setToDefaultMode = () => {
    this.togglePasswordInputsState(true);
    this.#cancelPasswordButton.node.classList.add(classes.hidden);
    this.#savePasswordButton.node.classList.add(classes.hidden);
    this.#changePasswordButton.node.classList.remove(classes.hidden);
    this.hidePasswordElements();

    this.#modalForData.node.remove();
  };

  #signIn = () => {
    auth
      .signIn({
        email: this.#emailInput.value,
        password: this.#passwordInputRepeat.value,
      })
      .catch((error: HttpErrorType) => {
        console.log(error);
      });
  };

  updatePassword = async () => {
    this.#currentUserPasswordInput.validate();
    this.#passwordInput.validate();
    this.#passwordInputRepeat.validate();

    if (
      !this.#currentUserPasswordInput.isValid ||
      !this.#passwordInput.isValid ||
      !this.#passwordInputRepeat.isValid
    ) {
      this.#errorText.node.textContent = 'There are no valid fields';
      this.#errorText.node.classList.remove(classes.hidden);
      return;
    }

    if (this.#passwordInput.value !== this.#passwordInputRepeat.value) {
      this.#errorText.node.textContent = 'New and repeat passwords are mismatch!';
      this.#errorText.node.classList.remove(classes.hidden);
      return;
    }

    await this.#customerController.updatePassword(
      this.#currentUserPasswordInput.value,
      this.#passwordInput.value,
      () => {
        this.setToDefaultMode();
      },
      (errorMsg) => {
        this.#errorText.node.textContent = errorMsg;
        this.#errorText.node.classList.remove(classes.hidden);
      },
    );
  };

  addChangePasswordClickHandler = () => {
    const passwordComponent = this.createUserPasswordComponent();
    this.#userDataWrapper.node.append(passwordComponent.node);
    this.#modalForData = new ModalWindow(classes.modal, false, this.#userPasswordWrapper);
    this.#modalForData.show();

    this.showPasswordElements();
    this.togglePasswordInputsState(false);
    this.#cancelPasswordButton.node.classList.remove(classes.hidden);
    this.#savePasswordButton.node.classList.remove(classes.hidden);
    this.#changePasswordButton.node.classList.add(classes.hidden);
  };

  addCancelPasswordClickHandler = () => {
    this.setToDefaultMode();
  };

  addSavePasswordClickHandler = () => {
    this.updatePassword();
  };

  createDeliveryAddressBasicStructure = () => {
    const deliveryAddressTitle = new BaseElement<HTMLHeadingElement>({
      tag: 'h2',
      text: 'Delivery address',
    });
    this.#addAddressBtn = this.createAddAddressBtn('shipping');
    this.#deliveryWrapper = new BaseElement<HTMLDivElement>({ tag: 'div' });
    this.#deliveryAddressesContainer = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.deliveryAddressesContainer,
    });
    this.#deliveryWrapper.node.append(deliveryAddressTitle.node);
    this.#deliveryWrapper.node.append(this.#addAddressBtn.node);
    this.#deliveryWrapper.node.append(this.#deliveryAddressesContainer.node);
    return this.#deliveryWrapper;
  };

  createBillingAddressBasicStructure = () => {
    const billingAddressTitle = new BaseElement<HTMLHeadingElement>({
      tag: 'h2',
      text: 'Billing address',
    });
    this.#addAddressBtn = this.createAddAddressBtn('billing');
    this.#billingWrapper = new BaseElement<HTMLDivElement>({ tag: 'div' });
    this.#billingAddressesContainer = new BaseElement<HTMLDivElement>({
      tag: 'div',
      class: classes.billingAddressesContainer,
    });
    this.#billingWrapper.node.append(billingAddressTitle.node);
    this.#billingWrapper.node.append(this.#addAddressBtn.node);
    this.#billingWrapper.node.append(this.#billingAddressesContainer.node);
    return this.#billingWrapper;
  };

  addNewAddress = (addressType: string) => {
    const newAddressForm = new AddressForm(
      {},
      addressType,
      emptyAddress,
      false,
      null,
      this.initializeAddresses,
      true,
    );
    newAddressForm.setAddedNewAddressMode();
    if (addressType === 'billing') {
      this.#billingAddressesContainer.node.append(newAddressForm.node);
    } else {
      this.#deliveryAddressesContainer.node.append(newAddressForm.node);
    }
  };

  createAddAddressBtn = (addressType: string) => {
    this.#addAddressBtn = new Button(
      { text: '+Add address', class: classes.button },
      ButtonClasses.NORMAL,
      () => this.addNewAddress(addressType),
    );
    this.#addAddressBtn.node.classList.add(classes.addAddressBtn);
    return this.#addAddressBtn;
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
