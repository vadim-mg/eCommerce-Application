import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import { AppRoutes } from '@Src/router/routes';
import classes from './style.module.scss';

export default class NotFound extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  constructor() {
    super({ containerTag: 'div', title: 'Main page' });
    this.#createContent();
    this.#showContent();
  }

  #createContent = () => {
    this.#content = new BaseElement<HTMLDivElement>({
      tag: 'main',
      class: classes.notFound,
    });
    const header = new BaseElement<HTMLDivElement>({ tag: 'h1', text: '404', class: classes.h1 });
    const span = new BaseElement<HTMLDivElement>({
      tag: 'span',
      text: 'Page not found',
      class: classes.span,
    });
    header.node.append(span.node);
    const text = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.text });
    text.node.innerHTML = `<p>Your path has led you into the unknown.<br>Roll the dice and <a href=${AppRoutes.MAIN}>start over<a>.</p>`;
    this.#content.node.append(header.node);
    this.#content.node.append(text.node);
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
