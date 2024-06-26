/* A hamburger sidebar in an app will have at least two content options:
a mobile menu and a product catalogue sidebar.
Therefore, this class is a shell for either type of content.
Don't forget to add the ability to close the sidebar when the content is clicked
using the method HamburgerSidebar.closeSidebar() based on the logic of the specific block. */

import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import classes from './style.module.scss';

type DivProps = Omit<ElementProps<HTMLDivElement>, 'tag'>;

export default class HamburgerSidebar extends BaseElement<HTMLElement> {
  closeElement!: BaseElement<HTMLElement>;

  elementCalled!: HTMLElement;

  constructor(props: DivProps, ...children: BaseElement<HTMLElement>[]) {
    super({ tag: 'div', ...props });
    this.node.classList.add(classes.sidebar);
    this.node.classList.add(classes.closed);
    this.#addCloseButton();
    this.#addContent(children);
  }

  #addContent = (children: BaseElement<HTMLElement>[]) => {
    const wrapper = new BaseElement<HTMLElement>(
      { tag: 'div', class: classes.wrapper },
      ...children,
    );
    this.node.append(wrapper.node);
  };

  #addCloseButton = () => {
    this.closeElement = new BaseElement<HTMLElement>({ tag: 'div', class: classes.cross });
    this.node.append(this.closeElement.node);
    this.closeElement.node.addEventListener('click', this.closeSidebar);
  };

  closeSidebar = () => {
    this.node.classList.toggle(classes.open);
    this.node.classList.toggle(classes.closed);
  };

  openSidebar = () => {
    this.node.classList.toggle(classes.open);
    this.node.classList.toggle(classes.closed);
  };
}
