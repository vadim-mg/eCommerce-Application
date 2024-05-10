import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import classes from './style.module.scss';

type FormProps = Omit<ElementProps<HTMLButtonElement>, 'tag'>;

export default class BaseForm extends BaseElement<HTMLFormElement> {
  constructor(props: FormProps, ...children: BaseElement<HTMLElement>[]) {
    super({ tag: 'form', ...props }, ...children);
    this.node.classList.add(classes.baseForm);
  }
}
