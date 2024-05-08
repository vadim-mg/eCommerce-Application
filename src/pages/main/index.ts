import BaseElement from '@Src/components/common/base-element';
import BasePage from '@Src/components/common/base-page';
import tag from '@Src/components/common/tag';
import Link from '@Src/components/ui/link';
import classes from './style.module.scss';

export default class MainPage extends BasePage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'div', title: 'Main page' });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.main,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: 'MainPage' }),
      new Link({ text: 'login', href: 'login' }),
      new Link({ text: 'registration', href: 'registration' }),
      new Link({ text: 'rs.school', href: 'https://rs.school', target: '_blank' }),
    );
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
