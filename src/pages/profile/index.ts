import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import userProfileLogo from '@Assets/icons/profile-icon-dark.svg';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText from '@Src/components/ui/input-text';
import CheckBox from '@Src/components/ui/checkbox';
import classes from './style.module.scss';

export default class ProfilePage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  titleWrapper!: BaseElement<HTMLDivElement>;

  userDataWrapper!: BaseElement<HTMLDivElement>;

  userDataDetailsWrapper!: BaseElement<HTMLDivElement>;

  userPasswordWrapper!: BaseElement<HTMLDivElement>;

  editDeleteBtnWrapper!: BaseElement<HTMLDivElement>;

  passwordInput!: InputText;

  passwordInputRepeat!: InputText;

  savePasswordButton!: Button;

  userDataDetailsTitle!: BaseElement<HTMLHeadingElement>;

  emailInput!: InputText;

  firstNameInput!: InputText;

  lastNameInput!: InputText;

  birthDateInput!: InputText;

  editDetailsBtn!: Button;

  saveDetailsBtn!: Button;

  addressWrapper!: BaseElement<HTMLDivElement>;

  addAddressBtn!: Button;

  editButton!: Button;

  deleteButton!: Button;

  countryInput!: InputText;

  cityInput!: InputText;

  postalCodeInput!: InputText;

  streetInput!: InputText;

  constructor() {
    super({ containerTag: 'main', title: 'profile page' });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.profile,
      },
      this.createTitleComponent(),
      this.createUserDataComponent(),
      this.createAddressComponent(),
    );
  };

  createTitleComponent = () => {
    this.titleWrapper = new BaseElement<HTMLDivElement>(
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
    return this.titleWrapper;
  };

  createEditDeleteBtnComponent = () => {
    this.editDeleteBtnWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.editDeleteBtnWrapper },
      (this.editButton = new Button(
        { text: 'Edit', class: classes.button },
        ButtonClasses.NORMAL,
        () => console.log('Edit'),
      )),
      (this.deleteButton = new Button(
        { text: 'Delete', class: classes.button },
        ButtonClasses.NORMAL,
        () => console.log('Delete'),
      )),
    );
    this.editButton.node.classList.add(classes.editButton);
    this.deleteButton.node.classList.add(classes.deleteButton);
    return this.editDeleteBtnWrapper;
  };

  createUserDataComponent = () => {
    this.userDataWrapper = new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.userDataWrapper,
      },
      this.createUserDataDetailsComponent(),
      this.createUserPasswordComponent(),
    );
    return this.userDataWrapper;
  };

  toggleUserDetailsInputsState = (state: boolean) => {
    this.emailInput.setDisabled(state);
    this.firstNameInput.setDisabled(state);
    this.lastNameInput.setDisabled(state);
    this.birthDateInput.setDisabled(state);
  };

  toggleUserAddressInputsState = (state: boolean) => {
    this.countryInput.setDisabled(state);
    this.cityInput.setDisabled(state);
    this.postalCodeInput.setDisabled(state);
    this.streetInput.setDisabled(state);
  };

  setEditMode = () => {
    this.toggleUserDetailsInputsState(false);

    this.birthDateInput.addDateInputType();

    this.editDetailsBtn.hide();
    this.saveDetailsBtn.show();
  };

  setSavedMode = () => {
    this.toggleUserDetailsInputsState(true);

    this.birthDateInput.addTextInputType();

    this.editDetailsBtn.show();
    this.saveDetailsBtn.hide();
  };

  createUserDataDetailsComponent = () => {
    this.userDataDetailsWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.userDataDetailsWrapper },
      (this.userDataDetailsTitle = new BaseElement<HTMLHeadingElement>({
        tag: 'h2',
        text: 'Personal details',
      })),
      (this.emailInput = new InputText({ name: 'email', type: 'email' }, 'E-mail')),
      (this.firstNameInput = new InputText({ name: 'firstName' }, 'Fist name')),
      (this.lastNameInput = new InputText({ name: 'lastName' }, 'Last name')),
      (this.birthDateInput = new InputText({ name: 'date-of-birth' }, 'Birth date')),
      (this.editDetailsBtn = new Button(
        { text: 'Edit details', class: classes.editDetailsBtn },
        ButtonClasses.NORMAL,
        this.setEditMode,
      )),
      (this.saveDetailsBtn = new Button(
        { text: 'Save', class: classes.saveDetailsBtn },
        ButtonClasses.NORMAL,
        this.setSavedMode,
      )),
    );
    this.birthDateInput.node.classList.add(classes.birthDateInput);

    this.toggleUserDetailsInputsState(true);
    this.saveDetailsBtn.hide();

    return this.userDataDetailsWrapper;
  };

  createUserPasswordComponent = () => {
    this.userPasswordWrapper = new BaseElement<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.userPasswordWrapper,
      },
      new BaseElement<HTMLHeadingElement>({ tag: 'h2', text: 'Change password' }),
      (this.passwordInput = new InputText(
        { name: 'password', maxLength: 20, minLength: 8, type: 'password' },
        'New password',
      )),
      (this.passwordInputRepeat = new InputText(
        { name: 'password', maxLength: 20, minLength: 8, type: 'password' },
        'Repeat password',
      )),
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.passwordRule,
        text: '! The password must be at least 8 characters long. It must contain Latin letters, at least one digit and at least one capital letter.',
      }),
      (this.savePasswordButton = new Button(
        { text: 'Save password', class: classes.button },
        ButtonClasses.NORMAL,
        () => console.log('Save password'),
      )),
    );
    this.passwordInput.node.classList.add(classes.inputMargin);
    this.passwordInputRepeat.node.classList.add(classes.inputMargin);
    this.savePasswordButton.node.classList.add(classes.savePasswordButton);
    return this.userPasswordWrapper;
  };

  createAddressComponent = () => {
    this.addressWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: classes.addressWrapper },
      (this.countryInput = new InputText({ name: 'country' }, 'Country')),
      (this.cityInput = new InputText({ name: 'city' }, 'City')),
      (this.postalCodeInput = new InputText({ name: 'postal code' }, 'Postal code')),
      (this.streetInput = new InputText({ name: 'street' }, 'Street')),
      // todo: change 3rd argument later
      new CheckBox({ class: classes.checkbox }, 'Use us default shipping address', true),
      this.createEditDeleteBtnComponent(),
    );
    this.toggleUserAddressInputsState(true);
    return this.addressWrapper;
  };

  createAddAddressBtn = () => {
    this.addAddressBtn = new Button(
      { text: '+Add address', class: classes.button },
      ButtonClasses.NORMAL,
      () => console.log('Add address'),
    );
    this.addAddressBtn.node.classList.add(classes.addAddressBtn);
    return this.addAddressBtn;
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
