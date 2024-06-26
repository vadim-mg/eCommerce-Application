import BaseElement from '@Src/components/common/base-element';
import Button, { ButtonClasses } from '@Src/components/ui/button';

import ContentPage from '@Src/components/common/content-page';
import InputText from '@Src/components/ui/input-text';
import { HttpErrorType } from '@commercetools/sdk-client-v2';

import CheckBox from '@Src/components/ui/checkbox';
import auth from '@Src/controllers/auth';
import State from '@Src/state';
import { CustomerDraft } from '@commercetools/platform-sdk';
import classes from './style.module.scss';

const TEST_USER: CustomerDraft = {
  email: 'test15@example.com',
  password: 'Asdf1234!@',
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
        'email',
        () => ({
          status: false,
          errorText: 'Error',
        }),
      )),
      new Button(
        { text: 'check email', class: classes.button },
        ButtonClasses.NORMAL,
        this.#checkEmail,
      ),
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
      new Button({ text: 'logout', class: classes.button }, ButtonClasses.BIG, auth.signOut),
      (this.#authCheckbox = new CheckBox(
        { class: classes.isLoggedIn },
        'isLoggedIn',
        State.getInstance().isLoggedIn,
      )),
      new Button({ text: 'me', class: classes.button }, ButtonClasses.BIG, this.#me),
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
        addresses: [
          {
            id: '1',
            country: 'RU',
            city: 'Moscow',
            postalCode: '650001',
            // streetName: 'arbat',
            // building: '25',
            // apartment: '10'
            additionalAddressInfo: 'Arbat street 25, 10',
          },
        ],
        defaultShippingAddress: 0,
        defaultBillingAddress: 0,
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

  #checkEmail = () => {
    this.#clearError();
    auth
      .isEmailExist(this.#email.value)
      .then((exist) => this.#showError(exist ? 'Email exist' : 'Email not exist!'))
      .catch((error: HttpErrorType) => {
        this.#showError(error.message);
      });
  };

  #me = () => {
    this.#clearError();
    auth
      .me()
      .then((info) => {
        this.#showError(JSON.stringify(info));
      })
      .catch((error: HttpErrorType) => {
        this.#showError(error.message);
      });
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
