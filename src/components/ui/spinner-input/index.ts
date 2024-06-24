import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import classes from './style.module.scss';

export type CallbackSpinner = () => Promise<void>;
export default class SpinnerInput extends BaseElement<HTMLElement> {
  #input: BaseElement<HTMLInputElement>;

  #minus: BaseElement<HTMLElement>;

  #plus: BaseElement<HTMLElement>;

  #callbackPlus: CallbackSpinner;

  #callbackMinus: CallbackSpinner;

  constructor(
    quantity: number,
    className: string,
    callbackPlus: CallbackSpinner,
    callbackMinus: CallbackSpinner,
  ) {
    super({ tag: 'div', class: classes.wrapper });
    this.node.classList.add(className);

    this.#input = tag({
      tag: 'input',
      class: classes.input,
      type: 'number',
      value: String(quantity),
    });
    this.#callbackPlus = callbackPlus;
    this.#callbackMinus = callbackMinus;
    this.#minus = tag({ tag: 'div', class: classes.minus, text: '-' });
    this.#plus = tag({ tag: 'div', class: classes.plus, text: '+' });

    this.#minus.node.addEventListener('click', this.#minusHandler);
    this.#plus.node.addEventListener('click', this.#plusHandler);

    this.#setMinus();
    this.node.append(this.#minus.node, this.#input.node, this.#plus.node);
  }

  #minusHandler = async () => {
    this.#disableButtons();
    this.#input.node.value = String(parseInt(this.#input.node.value, 10) - 1);
    await this.#callbackMinus();
    this.#setMinus();
  };

  #plusHandler = async () => {
    this.#disableButtons();
    this.#input.node.value = String(parseInt(this.#input.node.value, 10) + 1);
    await this.#callbackPlus();
    this.#setMinus();
  };

  #setMinus = () => {
    if (parseInt(this.#input.node.value, 10) <= 1) {
      this.#minus.node.classList.add(classes.disable);
    } else {
      this.#minus.node.classList.remove(classes.disable);
    }
  };

  #disableButtons = () => {
    if (!this.#minus.node.classList.contains(classes.disable))
      this.#minus.node.classList.add(classes.disable);
    if (!this.#plus.node.classList.contains(classes.disable))
      this.#plus.node.classList.add(classes.disable);
  };
}
