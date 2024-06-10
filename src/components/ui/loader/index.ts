import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import classes from './style.module.scss';

type LoaderProps = Omit<ElementProps, 'tag'>;

export default class Loader extends BaseElement<HTMLDivElement> {
  constructor(props: LoaderProps) {
    super({ tag: 'div', ...props });
    this.node.classList.add(classes.loader, classes.hidden);
  }

  show = () => {
    this.node.classList.remove(classes.hidden);
  };

  hide = () => {
    this.node.classList.add(classes.hidden);
  };
}
