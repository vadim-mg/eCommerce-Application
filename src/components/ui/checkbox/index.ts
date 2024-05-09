import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import classes from './style.module.scss';

export default class CheckBox extends BaseElement<HTMLElement> {
  inputElement!: BaseElement<HTMLInputElement>;

  labelElement!: BaseElement<HTMLLabelElement>;

  constructor(props: Omit<ElementProps<HTMLDivElement>, 'tag'>, labelText: string, value: string) {
    super({ tag: 'div', class: classes.checkboxWrapper, ...props });
    this.#createContent(labelText, value);
  }

  #createContent = (textContent: string, value: string) => {
    this.inputElement = new BaseElement<HTMLInputElement>({
      tag: 'input',
      class: classes.checkboxInput,
      type: 'checkbox',
      name: value,
      id: value,
    });

    this.labelElement = new BaseElement<HTMLLabelElement>({
      tag: 'label',
      class: classes.checkboxLabel,
      text: textContent,
    });
    this.labelElement.node.setAttribute('for', value);

    this.node.append(this.inputElement.node);
    this.node.append(this.labelElement.node);
  };
}
