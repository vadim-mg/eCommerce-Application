import BaseElement from '@Src/components/common/base-element';
import BaseForm from '@Src/components/common/base-form';
import FormPage from '@Src/components/common/form-page';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import InputText from '@Src/components/ui/input-text';
import Link from '@Src/components/ui/link';
import { validateEmail, validatePassword } from '@Src/utils/helpers';
import classes from './style.module.scss';

export default class LoginPage extends FormPage {
  form!: BaseForm;

  signupPromptElement!: BaseElement<HTMLDivElement>;

  constructor() {
    console.log('1');
    super({ title: 'Login page' });
    this.addForm(this.renderForm());
    this.addAdditionalLink(this.renderSignupPromptComponent());
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

  renderSignupPromptComponent = () => {
    this.signupPromptElement = new BaseElement(
      { tag: 'div', class: classes.signupPromptWrapper },
      new BaseElement({ tag: 'p', textContent: 'or' }),
      new BaseElement({ tag: 'p', textContent: 'if you don"t already have an account' }),
      new Link({ href: 'Sign in', text: 'Sign up', class: classes.signupLink }),
    );
    return this.signupPromptElement;
  };
}
