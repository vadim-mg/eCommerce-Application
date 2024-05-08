import BaseElement from '@Src/components/common/base-element';
import BasePage from '@Src/components/common/base-page';
import classes from './style.module.scss';

export default class MainPage extends BasePage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'div', title: 'Main page' });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = new BaseElement<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.main,
      },
      new BaseElement<HTMLDivElement>({ tag: 'h1', text: 'Main page' }),
    );
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
