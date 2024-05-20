import BaseForm from '@Src/components/common/base-form';
import FormPage from '@Src/components/common/form-page';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText from '@Src/components/ui/input-text';
import auth from '@Src/controllers/auth';
import { validateEmail, validatePassword } from '@Src/utils/helpers';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import classes from './style.module.scss';

export interface ValidationError {
  status: boolean;
  errorText: string;
}

export default class LoginPage extends FormPage {
  form!: BaseForm;

  #email!: InputText;

  #password!: InputText;

  #loginButton!: Button;

  #isValidEmail!: boolean;

  #isValidPassword!: boolean;

  constructor() {
    super({ title: 'Login page' });
    this.addForm(this.renderForm());
    this.addAdditionalLink("if you don't already have an account", 'signup', 'Sign up');
  }

  checkEmailValidation = (input: string): ValidationError => {
    this.#isValidEmail = validateEmail(input).status;
    return validateEmail(this.#email.value);
  };

  checkPasswordValidation = (input: string): ValidationError => {
    this.#isValidPassword = validatePassword(input).status;
    return validatePassword(this.#password.value);
  };

  renderForm(): BaseForm {
    this.form = new BaseForm(
      { class: classes.loginForm },

      (this.#email = new InputText(
        {
          name: 'email',
          placeholder: 'user@example.com',
          minLength: 2,
        },
        'E-mail',
        this.checkEmailValidation,
      )),
      (this.#password = new InputText(
        { name: 'password', minLength: 8, type: 'password' },
        'Password',
        this.checkPasswordValidation,
      )),
      (this.#loginButton = new Button(
        { text: 'Log in', class: classes.loginButton },
        [ButtonClasses.BIG],
        this.#onButtonLogin,
      )),
    );
    return this.form;
  }

  #onButtonLogin = () => {
    this.#email.validate();
    this.#password.validate();

    if (this.#password.isValid && this.#email.isValid) {
      this.#signIn();
    }
  };

  #signIn = () => {
    this.hideErrorComponent();
    auth
      .signIn({
        email: this.#email.value,
        password: this.#password.value,
      })
      .catch((error: HttpErrorType) => {
        this.showErrorComponent(error.message);
      });
  };
}
