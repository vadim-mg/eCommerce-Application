import BaseElement from '@Src/components/common/base-element';
import FormPage from '@Src/components/common/form-page';
import BaseForm from '@Src/components/common/base-form';
import InputText from '@Src/components/ui/input-text';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import classes from './style.module.scss';

export default class LoginPage extends FormPage {
  #content: BaseElement<HTMLDivElement> | null;

  constructor() {
    console.log('1');
    super({ title: 'Login page' });
    this.#content = null;
    this.#showContent();
  }

  #showContent = () => {
    this.#content = new BaseElement<HTMLDivElement>(
      { tag: 'main', class: classes.login },
      new BaseForm(
        { class: classes.loginForm },
        new InputText(true, 'login', 'login'),
        new InputText(true, 'password', 'password'),
        new Button({ text: 'Hello!!' }, [ButtonClasses.BIG], () => {
          console.log('login');
        }),
      ),
    );
    this.container.node.append(this.#content.node);
  };
}
