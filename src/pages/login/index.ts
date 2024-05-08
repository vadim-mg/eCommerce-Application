import BaseElement from '@Src/components/common/base-element';
import BasePage from '@Src/components/common/base-page';
import tag from '@Src/components/common/tag';
import classes from './style.module.scss';

export default class LoginPage extends BasePage {
  #content: BaseElement<HTMLDivElement> | null;

  constructor() {
    super({ containerTag: 'div', title: 'Login page' });
    this.#content = null;
    this.#showContent();
  }

  #showContent = () => {
    this.#content = new BaseElement<HTMLDivElement>(
      { tag: 'main', class: classes.login },
      tag({ tag: 'h1', text: 'Login page' }),
    );
    this.container.node.append(this.#content.node);
  };
}
