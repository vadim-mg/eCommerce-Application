import BaseForm from '@Src/components/common/base-form';
import FormPage from '@Src/components/common/form-page';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText from '@Src/components/ui/input-text';
import { validateEmail, validatePassword } from '@Src/utils/helpers';
import classes from './style.module.scss';

export default class LoginPage extends FormPage {
  form!: BaseForm;

  constructor() {
    console.log('1');
    super({ title: 'Login page' });
    this.addForm(this.renderForm());
    this.addAdditionalLink('if you don"t already have an account', 'Sign in');
  }

  renderForm(): BaseForm {
    this.form = new BaseForm(
      { class: classes.loginForm },
      new InputText(
        {
          name: 'email',
          placeholder: 'user@example.com',
          minLength: 2,
          type: 'email',
        },
        'E-mail',
        validateEmail,
      ),
      new InputText(
        { name: 'password', minLength: 8, type: 'password' },
        'Password',
        validatePassword,
      ),
      new Button({ text: 'Log in', class: classes.loginButton }, [ButtonClasses.BIG], () => {
        console.log('login');
      }),
    );
    return this.form;
  }
}
