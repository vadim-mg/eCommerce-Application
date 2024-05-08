import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import classes from './style.module.scss';

export default class CheckBox extends BaseElement<HTMLElement> {
  inputElem!: BaseElement<HTMLInputElement>;

  labelElem!: BaseElement<HTMLLabelElement>;

  constructor(props: Omit<ElementProps<HTMLDivElement>, 'tag'>, labelText: string, value: string) {
    super({ tag: 'div', class: classes.checkboxWrapper, ...props });
    this.#createContent(labelText, value);
  }

  #createContent = (textContent: string, value: string) => {
    this.inputElem = new BaseElement<HTMLInputElement>({
      tag: 'input',
      class: 'checkbox-input',
      type: 'checkbox',
      name: value,
      id: value,
    });

    this.labelElem = new BaseElement<HTMLLabelElement>({ tag: 'label', text: textContent });
    this.labelElem.node.setAttribute('for', value);

    this.node.append(this.inputElem.node);
    this.node.append(this.labelElem.node);
  };
}
