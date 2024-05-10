import BaseElement from '@Src/components/common/base-element';
import Container from '../container';

import classes from './style.module.scss';

export enum AccordionState {
  OPEN,
  CLOSED,
}

export default class Accordion extends BaseElement<HTMLSelectElement> {
  contentContainer!: Container;

  arrowElement!: BaseElement<HTMLElement>;

  header!: BaseElement<HTMLElement>;

  constructor(title: string, state: AccordionState, ...children: BaseElement<HTMLElement>[]) {
    super({ tag: 'div', class: [classes.accordion] });
    this.#createAccordion(title, children);
    this.#setDefaultState(state);
  }

  #createAccordion(title: string, children: BaseElement<HTMLElement>[]) {
    this.#addHeader(title);
    this.#addContent(children);
  }

  #addHeader(title: string) {
    this.header = new BaseElement({ tag: 'div', class: [classes.header] });
    const titleText = new BaseElement({ tag: 'div', class: [classes.title], textContent: title });
    this.header.node.append(titleText.node);
    this.arrowElement = new BaseElement({ tag: 'div', class: [classes.arrow] });
    this.header.node.addEventListener('click', this.#changeState.bind(this));
    this.header.node.append(this.arrowElement.node);
    this.node.append(this.header.node);
  }

  #addContent(children: BaseElement<HTMLElement>[]) {
    this.contentContainer = new Container({ tag: 'div', class: [classes.container] }, ...children);
    this.node.append(this.contentContainer.node);
  }

  #setDefaultState(state: AccordionState) {
    if (state === AccordionState.OPEN) {
      this.node.classList.add(classes.open);
    } else {
      this.node.classList.add(classes.close);
    }
  }

  #changeState() {
    this.node.classList.toggle(classes.close);
    this.node.classList.toggle(classes.open);
  }
}
