import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import classes from './style.module.scss';

interface ValidationError {
  status: boolean;
  errorText: string;
}
type CallbackValidation = (input: string) => ValidationError;

type InputProps = Omit<ElementProps<HTMLInputElement>, 'tag'>;

export default class InputText extends BaseElement<HTMLInputElement> {
  inputElement!: BaseElement<HTMLInputElement>;

  inputRow!: BaseElement<HTMLDivElement>;

  errorElement!: BaseElement<HTMLDivElement>;

  clearButtonElement!: BaseElement<HTMLDivElement>;

  toggleVisibilityElement!: BaseElement<HTMLDivElement>;

  labelElement?: BaseElement<HTMLLabelElement>;

  isValid!: boolean;

  callbackValidation!: CallbackValidation;

  constructor(
    propsInput: InputProps,
    labelText?: string,
    callbackValidation?: CallbackValidation,
  ) {
    super({ tag: 'div', class: classes.wrapper });
    this.#createContent(propsInput, labelText);
    if (callbackValidation) {
      this.callbackValidation = callbackValidation;
      this.inputElement.node.addEventListener('input', this.validate.bind(this));
    }
  }

  #createContent = (props: InputProps, labelText?: string) => {
    // if we want an input with a label
    if (labelText && props.name) {
      this.#addLabel(props.name, labelText);
    }
    this.#addInput(props);
    // check if the input type is password, show toggle visibility button
    if (props.type === 'password') {
      this.#addTogglePasswordBtn();
    } else if (props.type !== 'date') {
      this.#addClearButton();
    }
    this.#addErrorElement();
  };

  #addInput = (props: InputProps) => {
    this.inputRow = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.inputRow });

    this.inputElement = new BaseElement<HTMLInputElement>({
      tag: 'input',
      type: props.type ?? 'text',
      class: classes.input,
      ...props,
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
    this.errorText = '';
    this.node.append(this.errorElement.node);
  };

  #addClearButton = () => {
    this.clearButtonElement = new BaseElement({ tag: 'div', class: [classes.clear] });
    this.clearButtonElement.node.addEventListener('click', this.clearInput.bind(this));
    this.inputRow.node.append(this.clearButtonElement.node);
  };

  #addTogglePasswordBtn = () => {
    this.toggleVisibilityElement = new BaseElement({
      tag: 'div',
      class: [classes.hidePassword],
    });
    this.toggleVisibilityElement.node.addEventListener('click', this.togglePasswordVisibility);
    this.inputRow.node.append(this.toggleVisibilityElement.node);
  };

  set errorText(text: string) {
    this.errorElement.node.textContent = text;
  }

  validate = () => {
    const error = this.callbackValidation(this.value);
    if (!error.status) {
      this.showError(error.errorText);
    } else {
      this.hiddenError();
    }
  };

  togglePasswordVisibility = () => {
    if (this.inputElement.node.type === 'password') {
      this.inputElement.node.type = 'text';
      this.toggleVisibilityElement.node.classList.remove(classes.hidePassword);
      this.toggleVisibilityElement.node.classList.add(classes.showPassword);
    } else {
      this.inputElement.node.type = 'password';
      this.toggleVisibilityElement.node.classList.remove(classes.showPassword);
      this.toggleVisibilityElement.node.classList.add(classes.hidePassword);
    }
  };

  clearInput = () => {
    this.inputElement.node.value = '';
  };

  isHiddenError = () => this.errorElement.node.classList.contains(classes.hidden);

  showError = (errorText: string) => {
    this.errorText = errorText;
    this.errorElement.node.classList.remove(classes.hidden);
    this.inputRow.node.classList.add(classes.invalid);
    this.isValid = false;
  };

  hiddenError = () => {
    this.errorText = '';
    this.errorElement.node.classList.add(classes.hidden);
    this.inputRow.node.classList.remove(classes.invalid);
    this.isValid = true;
  };

  setDisabled = (state: boolean) => {
    this.inputElement.node.disabled = state;
  };

  // I added this methods to change birth date input type (from text to date)
  addDateInputType = () => {
    this.inputElement.node.type = 'date';
    this.clearButtonElement.node.hidden = true;
  }

  addTextInputType = () => {
    this.inputElement.node.type = 'text';
    this.clearButtonElement.node.hidden = false;
  }

  get value() {
    return this.inputElement.node.value;
  }

  set value(value: string) {
    this.inputElement.node.value = value;
  }
}
