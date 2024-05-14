import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import Link from '@Src/components/ui/link';
import classes from './style.module.scss';

export default class MainPage extends ContentPage {
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
      new Link({ text: 'login', href: 'login', class: classes.listItem }),
      new Link({ text: 'registration', href: 'registration', class: classes.listItem }),
      new Link({ text: 'rs.school', href: 'https://rs.school', target: '_blank', class: classes.listItem }),
      new Link({ text: 'example', href: 'hiddenExample', class: classes.listItem }),
      new Link({ text: 'api', href: 'hiddenApi', class: classes.listItem }),
      new BaseElement({ tag: 'br' }),
    );
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
