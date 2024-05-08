import BaseElement from '@Src/components/common/base-element';
import BasePage from '@Src/components/common/base-page';
import tag from '@Src/components/common/tag';
import classes from './style.module.scss';

export default class RegistrationPage extends BasePage {
  #content: BaseElement<HTMLDivElement> | null;

  constructor() {
    super({ containerTag: 'div', title: 'Registration page' });
    this.#content = null;
    this.#showContent();
  }

  #showContent = () => {
    this.#content = new BaseElement<HTMLDivElement>(
      { tag: 'main', class: classes.registration },
      tag({ tag: 'h1', text: 'Registration page' }),
    );
    this.container.node.append(this.#content.node);
  };
}
