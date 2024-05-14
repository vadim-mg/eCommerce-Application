import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import classes from './style.module.scss';

let counterValue = 0;

const counter = () => {
  counterValue += 1;
  return counterValue;
};

export default class CheckBox extends BaseElement<HTMLElement> {
  inputElement!: BaseElement<HTMLInputElement>;

  labelElement!: BaseElement<HTMLLabelElement>;

  constructor(
    props: Omit<ElementProps<HTMLDivElement>, 'tag'>,
    labelText: string,
    value: boolean,
  ) {
    super({ tag: 'div', ...props });
    this.node.classList.add(classes.checkboxWrapper);
    this.#createContent(labelText, value);
  }

  #createContent = (textContent: string, value: boolean) => {
    const uniqueId = `cb${counter()}`;
    this.inputElement = new BaseElement<HTMLInputElement>({
      tag: 'input',
      class: classes.checkboxInput,
      type: 'checkbox',
      id: uniqueId,
      checked: value,
    });

    this.labelElement = new BaseElement<HTMLLabelElement>({
      tag: 'label',
      class: classes.checkboxLabel,
      text: textContent,
    });
    this.labelElement.node.setAttribute('for', uniqueId);

    this.node.append(this.inputElement.node);
    this.node.append(this.labelElement.node);
  };

  set checked(value) {
    this.inputElement.node.checked = value;
  }

  get checked() {
    return this.inputElement.node.checked;
  }

  set disabled(value) {
    this.inputElement.node.disabled = value;
  }

  get disabled() {
    return this.inputElement.node.disabled;
  }
}
