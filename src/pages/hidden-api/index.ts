import BaseElement from '@Src/components/common/base-element';
import Button, { ButtonClasses } from '@Src/components/ui/button';

import ContentPage from '@Src/components/common/content-page';
import InputText from '@Src/components/ui/input-text';
import { HttpErrorType } from '@commercetools/sdk-client-v2';

import CheckBox from '@Src/components/ui/checkbox';
import auth from '@Src/controllers/auth';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import State from '@Src/state';
import { CustomerDraft } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

const TEST_USER: CustomerDraft = {
  email: 'test5@example.com',
  password: '123456',
  firstName: 'Anna',
  lastName: 'Frank',
  dateOfBirth: '2005-05-05',
  addresses: [],
};

export default class HiddenApiPage extends ContentPage {
  #content!: BaseElement<HTMLFormElement>;

  #email!: InputText;

  #password!: InputText;

  #firstName!: InputText;

  #lastName!: InputText;

  #dateOfBirth!: InputText;

  #errorField!: BaseElement<HTMLParagraphElement>;

  #authCheckbox!: CheckBox;

  constructor() {
    super({ containerTag: 'div', title: 'Hidden Example page' });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = new BaseElement<HTMLFormElement>(
      {
        tag: 'form',
        class: classes.api,
      },

      (this.#firstName = new InputText(
        {
          name: 'firstName',
          placeholder: TEST_USER.firstName,
          maxLength: 20,
          minLength: 2,
          value: TEST_USER.firstName,
        },
        'FirstName',
        () => ({
          status: false,
          errorText: 'Error',
        }),
      )),
      (this.#lastName = new InputText(
        {
          name: 'lastName',
          placeholder: TEST_USER.lastName,
          maxLength: 20,
          minLength: 2,
          value: TEST_USER.lastName,
        },
        'LastName',
        () => ({
          status: false,
          errorText: 'Error',
        }),
      )),
      (this.#dateOfBirth = new InputText(
        {
          name: 'date of birth',
          placeholder: TEST_USER.dateOfBirth,
          value: TEST_USER.dateOfBirth,
          type: 'date',
          min: '1900-01-01',
          max: '2020-01-01',
        },
        'Date of birth',
        () => ({
          status: false,
          errorText: 'Error',
        }),
      )),
      (this.#email = new InputText(
        {
          name: 'email',
          placeholder: 'email@example.com',
          maxLength: 20,
          minLength: 2,
          value: TEST_USER.email,
          type: 'email',
        },
        'Name',
        () => ({
          status: false,
          errorText: 'Error',
        }),
      )),
      (this.#password = new InputText(
        {
          name: 'password',
          maxLength: 20,
          minLength: 8,
          value: TEST_USER.password,
          type: 'password',
        },
        'Password',
        () => ({
          status: true,
          errorText: 'Error',
        }),
      )),
      (this.#errorField = new BaseElement<HTMLParagraphElement>({
        tag: 'p',
        text: '',
        class: classes.error,
      })),
      new Button({ text: 'signup', class: classes.button }, ButtonClasses.BIG, this.#signUp),
      new Button({ text: 'login', class: classes.button }, ButtonClasses.BIG, this.#signIn),
      new Button({ text: 'logout', class: classes.button }, ButtonClasses.BIG, this.#signOut),
      (this.#authCheckbox = new CheckBox(
        { class: classes.isLoggedIn },
        'isLoggedIn',
        State.getInstance().isLoggedIn,
      )),
    );

    this.#authCheckbox.disabled = true;
    this.#content.node.addEventListener('submit', (e) => e.preventDefault);
  };

  #showError = (errMsg: string) => {
    this.#errorField.node.textContent = errMsg;
  };

  #clearError = () => {
    this.#errorField.node.textContent = '';
  };

  #signUp = () => {
    this.#clearError();
    auth
      .signUp({
        email: this.#email.value,
        password: this.#password.value,
        firstName: this.#firstName.value,
        lastName: 'Hardcoded Smith',
      })
      .catch((error: HttpErrorType) => {
        this.#showError(error.message);
      });
  };

  // // read https://docs.commercetools.com/api/projects/customers#authenticate-sign-in-customer
  #signIn = () => {
    this.#clearError();
    auth
      .signIn({
        email: this.#email.value,
        password: this.#password.value,
      })
      .catch((error: HttpErrorType) => {
        this.#showError(error.message);
      });
  };

  // // read https://docs.commercetools.com/api/projects/customers#authenticate-sign-in-customer
  #signOut = () => {
    this.#clearError();
    auth.signOut();
    Router.getInstance().route(AppRoutes.LOGOUT);
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
