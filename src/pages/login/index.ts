import BaseElement from '@Src/components/common/base-element';
import FormPage from '@Src/components/common/form-page';
import BaseForm from '@Src/components/common/base-form';
import InputText from '@Src/components/ui/input-text';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import classes from './style.module.scss';

export default class LoginPage extends FormPage {
  #content: BaseElement<HTMLDivElement> | null;

  form!: BaseForm;

  constructor() {
    console.log('1');
    super({ title: 'Login page' });
    this.#content = null;
    // this.#showContent();
  }

  renderForm(): Node {
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
      new Button({ text: 'Hello!!' }, [ButtonClasses.BIG], () => {
        console.log('login');
      }),
    );
    return this.form.node;
  }

  #showContent = () => {
    this.#content = new BaseElement<HTMLDivElement>(
      { tag: 'main', class: classes.login },
      new BaseForm(
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
        new Button({ text: 'Hello!!' }, [ButtonClasses.BIG], () => {
          console.log('login');
        }),
      ),
    );
    this.container.node.append(this.#content.node);
  };
}
