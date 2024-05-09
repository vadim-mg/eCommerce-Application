import BaseElement from '@Src/components/common/base-element';

import classes from './style.module.scss';

export enum InputsPatterns {
  TEXT = `/^[a-zA-Z]+(?:[-s]?[a-zA-Z]+)*$/`,
  PASSWORD = `/^(?=.*[a-zA-Z])(?=.*).{8,}$/`,
}

export default class InputText extends BaseElement<HTMLInputElement> {
  inputElement!: BaseElement<HTMLInputElement>;

  inputRow!: BaseElement<HTMLDivElement>;

  errorElement!: BaseElement<HTMLDivElement>;

  clearButtonElement!: BaseElement<HTMLDivElement>;

  labelElement?: BaseElement<HTMLLabelElement>;

  constructor(
    required: boolean,
    name: string,
    placeholder?: string,
    pattern?: string,
    labelText?: string,
  ) {
    super({ tag: 'div', class: classes.wrapper });
    this.#createContent(required, name, placeholder, pattern, labelText);
  }

  #createContent = (
    required: boolean,
    name: string,
    placeholder?: string,
    pattern?: string,
    labelText?: string,
  ) => {
    // if we want an input with a label
    if (labelText) {
      this.#addLabel(name, labelText);
    }
    this.#addInput(required, name, pattern, placeholder);
    this.#addClearButton();
    this.#addErrorElement();
  };

  #addInput = (required: boolean, name: string, pattern?: string, placeholder?: string) => {
    this.inputRow = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.inputRow });

    this.inputElement = new BaseElement<HTMLInputElement>({
      tag: 'input',
      class: classes.input,
      type: 'text',
      name,
      id: name,
      placeholder,
      required,
      pattern,
    });
    this.inputRow.node.append(this.inputElement.node);
    this.node.append(this.inputRow.node);
  };

  #addLabel = (name: string, labelText: string) => {
    this.labelElement = new BaseElement<HTMLLabelElement>({
      tag: 'label',
      class: classes.label,
      text: labelText,
    });
    this.labelElement.node.setAttribute('for', name);
    this.node.append(this.labelElement.node);
  };

  #addErrorElement = () => {
    this.errorElement = new BaseElement({
      tag: 'div',
      class: [classes.errorText, classes.hidden],
    });
    this.errorElement.node.innerHTML = '';
    this.node.append(this.errorElement.node);
  };

  #addClearButton = () => {
    this.clearButtonElement = new BaseElement({ tag: 'div', class: [classes.clear] });
    this.clearButtonElement.node.addEventListener('click', this.clearInput.bind(this));
    this.inputRow.node.append(this.clearButtonElement.node);
  };

  clearInput = () => {
    this.inputElement.node.value = '';
  };

  showError = () => this.errorElement.node.classList.remove(classes.hidden);

  hiddenError = () => this.errorElement.node.classList.add(classes.hidden);

  setDisabled = (state: boolean) => {
    this.inputElement.node.disabled = state;
  };

  getValue = () => this.inputElement.node.value;

  setValue = (value: string) => {
    this.inputElement.node.value = value;
  };
}
