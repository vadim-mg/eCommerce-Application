import BaseForm from '@Src/components/common/base-form';
import FormPage from '@Src/components/common/form-page';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText from '@Src/components/ui/input-text';
import { validateEmail, validatePassword } from '@Src/utils/helpers';
import auth from '@Src/controllers/auth';
import { HttpErrorType } from '@commercetools/sdk-client-v2';
import classes from './style.module.scss';

export default class LoginPage extends FormPage {
  form!: BaseForm;

  #email!: InputText;

  #password!: InputText;

  #loginButton!: Button;

  constructor() {
    super({ title: 'Login page' });
    this.addForm(this.renderForm());
    this.addAdditionalLink("if you don't already have an account", 'signup', 'Sign up');
  }

  renderForm(): BaseForm {
    this.form = new BaseForm(
      { class: classes.loginForm },

      (this.#email = new InputText(
        {
          name: 'email',
          placeholder: 'user@example.com',
          minLength: 2,
          type: 'email',
        },
        'E-mail',
        validateEmail,
        this.updateLoginButton,
      )),
      (this.#password = new InputText(
        { name: 'password', minLength: 8, type: 'password' },
        'Password',
        validatePassword,
        this.updateLoginButton,
      )),
      (this.#loginButton = new Button(
        { text: 'Log in', class: classes.loginButton },
        [ButtonClasses.BIG],
        this.#signIn,
      )),
    );
    this.#loginButton.disable();
    return this.form;
  }

  updateLoginButton = () => {
    if (this.#password.isValid(validatePassword) && this.#email.isValid(validateEmail)) {
      this.#loginButton.enable();
    } else {
      this.#loginButton.disable();
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
