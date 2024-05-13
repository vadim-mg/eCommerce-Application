import FormPage from '@Src/components/common/form-page';
import BaseForm from '@Src/components/common/base-form';
import InputText from '@Src/components/ui/input-text';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import BaseElement from '@Src/components/common/base-element';
import Link from '@Src/components/ui/link';
import classes from './style.module.scss';

export default class LoginPage extends FormPage {
  form!: BaseForm;

  signupPromptElement!: BaseElement<HTMLDivElement>;

  constructor() {
    console.log('1');
    super({ title: 'Login page' });
    this.addForm(this.renderForm());
    this.addSignupPrompt(this.renderSignupPromptComponent());
  }

  renderForm(): BaseForm {
    this.form = new BaseForm(
      { class: classes.loginForm },
      new InputText(
        {
          name: 'name',
          placeholder: 'John',
          maxLength: 20,
          minLength: 2,
        },
        'Name',
        () => ({
          status: false,
          errorText: 'Error',
        }),
      ),
      new InputText(
        { name: 'password', placeholder: '********', maxLength: 20, minLength: 8 },
        'Password',
        () => ({
          status: true,
          errorText: 'Error',
        }),
      ),
      new Button({ text: 'Log in', class: classes.loginButton }, [ButtonClasses.BIG], () => {
        console.log('login');
      }),
    );
    return this.form;
  }

  renderSignupPromptComponent = () => {
    this.signupPromptElement = new BaseElement({ tag: 'div', class: classes.signupPromptWrapper },
      new BaseElement({ tag: 'p', textContent: 'or' }),
      new BaseElement({ tag: 'p', textContent: 'if you don"t already have an account' }),
      new Link({ text: 'Sign up', class: classes.signupLink }),
    )
    return this.signupPromptElement;
  }
}
