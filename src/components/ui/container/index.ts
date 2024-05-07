import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import classes from './style.module.scss';

// wrapper for child elements with class conteiner
export default class Container extends BaseElement<HTMLElement> {
  constructor(props: ElementProps, ...children: BaseElement<HTMLElement>[]) {
    super(props, ...children);
    this.node.classList.add(classes.container);
  }
}
