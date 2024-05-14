import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import Link from '@Src/components/ui/link';
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
    const text = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.text, });
    const p1 = new BaseElement<HTMLElement>({ tag: 'p', class: classes.text, text: 'Your path has led you into the unknown.' });
    const p2 = new BaseElement<HTMLElement>({ tag: 'p', class: classes.text, text: 'Roll the dice and ' });
    const link = new Link({
      href: AppRoutes.MAIN,
      text: 'start over',
      class: classes.link,
    });
    text.node.append(p1.node);
    text.node.append(p2.node);
    p2.node.append(link.node);
    this.#content.node.append(header.node);
    this.#content.node.append(text.node);
  };

  #showContent = () => {
    this.container.node.append(this.#content.node);
  };
}
