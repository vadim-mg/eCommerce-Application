import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import classes from './style.module.scss';

export default class AboutPage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'main', title: 'about page' });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'main',
        class: classes.about,
      },
      tag<HTMLHeadingElement>({ tag: 'h1', text: this.title }),);
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
