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

  trimmedEmailValue!: string;

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
          name: 'email',
          placeholder: 'user@example.com',
          minLength: 2,
          type: 'email',
        },
        'E-mail',
        this.validateEmail
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

  validateEmail = (inputValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domainRegex = /@([^\s@]+\.[^\s@]+)$/;

    this.trimmedEmailValue = inputValue.trim();
    if (!this.trimmedEmailValue.match(emailRegex)) {
      if (!this.trimmedEmailValue.includes('@')) {
        return {
          status: false,
          errorText: 'Your email address should include an "@ symbol separating the local part and domain name',
        }
      }
      if (!this.trimmedEmailValue.match(domainRegex)) {
        return {
          status: false,
          errorText: 'Please include a domain name in your email address (e.g., example.com)',
        }
      }
      return {
        status: false,
        errorText: 'Please enter a valid email address. It should follow the format: user@example.com',
      }
    }
    
    return {
      status: true,
      errorText: '',
    }
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
