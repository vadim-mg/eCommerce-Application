import BaseElement from '@Src/components/common/base-element';
import Container from '../container';

import classes from './style.module.scss';

export enum AccordionState {
  OPEN,
  CLOSED,
}

export default class Accordion extends BaseElement<HTMLDivElement> {
  contentContainer!: Container;

  contentWrapper!: Container;

  fullHeight!: number;

  isOpen: boolean = false;

  constructor(title: string, state: AccordionState, ...children: BaseElement<HTMLElement>[]) {
    super({ tag: 'div', class: [classes.accordion] });
    this.#createAccordion(state, title, children);
    // mobile flip support
    this.#setFullHeight();
  }

  #createAccordion(state: AccordionState, title: string, children: BaseElement<HTMLElement>[]) {
    this.#addHeader(title);
    this.#addContent(state, children);
  }

  #addHeader = (title: string) => {
    const header = new BaseElement({ tag: 'div', class: [classes.header] });
    const titleText = new BaseElement({ tag: 'div', class: [classes.title], textContent: title });
    header.node.append(titleText.node);
    this.node.append(header.node);
    header.node.addEventListener('click', () => {
      this.#toggleAccordion();
    });
  };

  #addContent = (state: AccordionState, children: BaseElement<HTMLElement>[]) => {
    this.contentWrapper = new BaseElement<HTMLDivElement>({ tag: 'div', class: [classes.wrapper] }, ...children);
    this.contentContainer = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: [classes.container] },
      this.contentWrapper,
    );
    this.node.append(this.contentContainer.node);
    // element rendering delay
    window.requestAnimationFrame(() => {
      this.fullHeight = this.contentWrapper.node.offsetHeight;
      this.#setDefaultState(state);
      console.log(children[1].node.offsetHeight);
    });
  };

  #setDefaultState = (state: AccordionState) => {
    if (state === AccordionState.OPEN) {
      this.isOpen = true;
      this.node.classList.add(classes.open);
      this.#showContent();
    } else {
      this.isOpen = false;
      this.node.classList.add(classes.closed);
      this.#hiddenContent();
    }
  };

  #toggleAccordion = () => {
    this.isOpen = !this.isOpen;
    this.node.classList.toggle(classes.open);
    this.node.classList.toggle(classes.closed);
    if (this.isOpen) {
      this.#showContent();
    } else {
      this.#hiddenContent();
    }
  };

  #showContent = () => {
    this.contentContainer.node.style.height = `${this.fullHeight}px`;
  };

  #hiddenContent = () => {
    this.contentContainer.node.style.height = '0';
  };

  #setFullHeight = () => {
    window.addEventListener('resize', () => {
      this.fullHeight = this.contentWrapper.node.offsetHeight;
      console.log(this.fullHeight);
      if (this.isOpen) {
        this.#showContent();
      }
    });
  };
}
