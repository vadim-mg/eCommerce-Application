import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import userProfileLogo from '@Assets/icons/profile-icon-dark.svg';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText from '@Src/components/ui/input-text';
import AddressForm from '@Src/components/logic/address-form';
import auth from '@Src/controllers/auth';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import classes from './style.module.scss';

const createTitleComponent = () => {
  const titleWrapper = new BaseElement<HTMLDivElement>(
    { tag: 'div', class: classes.titleWrapper },
    new BaseElement<HTMLImageElement>({
      tag: 'img',
      src: userProfileLogo,
      alt: 'User profile logo',
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
        this.#emailInput.value = customer.email ?? '';
        this.#firstNameInput.value = customer.firstName ?? '';
        this.#lastNameInput.value = customer.lastName ?? '';
        this.#birthDateInput.value = customer.dateOfBirth?.split('-').join('.') ?? '';

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

  setSavedMode = () => {
    this.toggleUserDetailsInputsState(true);

    this.#birthDateInput.addTextInputType();

    this.#editDetailsBtn.show();
    this.#saveDetailsBtn.hide();
  };

  createUserDataDetailsComponent = () => {
    this.#userDataDetailsWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.userDataDetailsWrapper },
      new BaseElement<HTMLHeadingElement>({
        tag: 'h2',
        text: 'Personal details',
      }),
      (this.#emailInput = new InputText({ name: 'email', type: 'email' }, 'E-mail')),
      (this.#firstNameInput = new InputText({ name: 'firstName' }, 'Fist name')),
      (this.#lastNameInput = new InputText({ name: 'lastName' }, 'Last name')),
      (this.#birthDateInput = new InputText({ name: 'date-of-birth' }, 'Birth date')),
      (this.#editDetailsBtn = new Button(
        { text: 'Edit details', class: classes.btnLineHeight },
        ButtonClasses.NORMAL,
        this.setEditMode,
      )),
      (this.#saveDetailsBtn = new Button(
        { text: 'Save', class: classes.btnLineHeight },
        ButtonClasses.NORMAL,
        this.setSavedMode,
      )),
    );
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
