import BaseElement from '@Src/components/common/base-element';
import BasePage from '@Src/components/common/base-page';
import tag from '@Src/components/common/tag';
import classes from './style.module.scss';

export default class RegisterPage extends BasePage {
  #content: BaseElement<HTMLDivElement> | null;

  constructor() {
    super({ containerTag: 'div', title: 'Register page' });
    this.#content = null;
    this.#showContent();
  }

  #showContent = () => {
    this.#content = new BaseElement<HTMLDivElement>(
      { tag: 'main', class: classes.register },
      tag({ tag: 'h1', text: 'Register page' }),
    );
    this.container.node.append(this.#content.node);
  };
}
