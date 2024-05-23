import BaseElement from '@Src/components/common/base-element';

import classes from './style.module.scss';

export enum AccordionState {
  OPEN,
  CLOSED,
}

export default class Accordion extends BaseElement<HTMLDivElement> {
  contentContainer!: BaseElement<HTMLDivElement>;

  contentWrapper!: BaseElement<HTMLDivElement>;

  fullHeight!: number;

  header!: BaseElement<HTMLElement>;

  isOpen: boolean = false;

  constructor(
    title: string,
    state: AccordionState,
    className: string | string[],
    ...children: BaseElement<HTMLElement>[]
  ) {
    super({ tag: 'div', class: className });
    this.node.classList.add(classes.accordion);
    this.#createAccordion(state, title, children);
  }

  #createAccordion(state: AccordionState, title: string, children: BaseElement<HTMLElement>[]) {
    this.#addHeader(title);
    this.#addContent(state, children);
  }

  #addHeader = (title: string) => {
    const header = new BaseElement({ tag: 'div', class: [classes.header] });
    this.header = header;
    const titleText = new BaseElement({ tag: 'div', class: [classes.title], textContent: title });
    header.node.append(titleText.node);
    this.node.append(header.node);
    header.node.addEventListener('click', () => {
      this.toggleAccordion();
    });
  };

  #addContent = (state: AccordionState, children: BaseElement<HTMLElement>[]) => {
    this.contentWrapper = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: [classes.wrapper] },
      ...children,
    );
    this.contentContainer = new BaseElement<HTMLDivElement>(
      { tag: 'div', class: [classes.container] },
      this.contentWrapper,
    );
    this.node.append(this.contentContainer.node);
    // element rendering delay
    window.requestAnimationFrame(() => {
      this.#setDefaultState(state);
    });
  };

  #setDefaultState = (state: AccordionState) => {
    if (state === AccordionState.OPEN) {
      this.isOpen = true;
      this.node.classList.add(classes.open);
    } else {
      this.isOpen = false;
      this.node.classList.add(classes.closed);
    }
  };

  toggleAccordion = () => {
    this.isOpen = !this.isOpen;
    this.node.classList.toggle(classes.open);
    this.node.classList.toggle(classes.closed);
  };
}
