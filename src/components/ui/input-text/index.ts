import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import classes from './style.module.scss';

interface ValidationError {
  status: boolean;
  errorText: string;
}
type CallbackValidation = () => ValidationError;

type InputProps = Omit<ElementProps<HTMLInputElement>, 'tag'>;

export default class InputText extends BaseElement<HTMLInputElement> {
  inputElement!: BaseElement<HTMLInputElement>;

  inputRow!: BaseElement<HTMLDivElement>;

  errorElement!: BaseElement<HTMLDivElement>;

  clearButtonElement!: BaseElement<HTMLDivElement>;

  labelElement?: BaseElement<HTMLLabelElement>;

  constructor(
    propsInput: InputProps,
    labelText?: string,
    callbackValidation?: CallbackValidation,
  ) {
    super({ tag: 'div', class: classes.wrapper });
    this.#createContent(propsInput, labelText);
    if (callbackValidation) {
      this.inputElement.node.addEventListener(
        'input',
        this.#validate.bind(this, callbackValidation),
      );
    }
  }

  #createContent = (props: InputProps, labelText?: string) => {
    // if we want an input with a label
    if (labelText && props.name) {
      this.#addLabel(props.name, labelText);
    }
    this.#addInput(props);
    this.#addClearButton();
    this.#addErrorElement();
  };

  #addInput = (props: InputProps) => {
    this.inputRow = new BaseElement<HTMLDivElement>({ tag: 'div', class: classes.inputRow });

    this.inputElement = new BaseElement<HTMLInputElement>({
      tag: 'input',
      type: 'text',
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
    this.errorElement.node.innerHTML = '';
    this.node.append(this.errorElement.node);
  };

  #addClearButton = () => {
    this.clearButtonElement = new BaseElement({ tag: 'div', class: [classes.clear] });
    this.clearButtonElement.node.addEventListener('click', this.clearInput.bind(this));
    this.inputRow.node.append(this.clearButtonElement.node);
  };

  #validate = (callbackValidation: CallbackValidation) => {
    console.log('!');
    const error = callbackValidation();
    if (!error.status) {
      this.errorElement.node.innerHTML = error.errorText;
      if (this.isHiddenError()) {
        this.showError();
      }
      if (!this.inputRow.node.classList.contains(classes.invalid)) {
        this.inputRow.node.classList.add(classes.invalid);
      }
      this.inputRow.node.classList.add(classes.invalid);
    } else {
      if (!this.isHiddenError()) {
        this.hiddenError();
      }
      if (this.inputRow.node.classList.contains(classes.invalid)) {
        console.log('&');
        this.inputRow.node.classList.remove(classes.invalid);
      }
    }
  };

  clearInput = () => {
    this.inputElement.node.value = '';
  };

  isHiddenError = () => this.errorElement.node.classList.contains(classes.hidden);

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
