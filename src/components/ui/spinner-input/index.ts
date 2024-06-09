import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import classes from './style.module.scss';

export default class SpinerInput extends BaseElement<HTMLElement> {
  #input: BaseElement<HTMLInputElement>;

  #minus: BaseElement<HTMLElement>;

  #plus: BaseElement<HTMLElement>;

  constructor(quantity: number, className: string, callback: () => void) {
    super({ tag: 'div', class: classes.wrapper });
    this.node.classList.add(className);

    this.#input = tag({
      tag: 'input',
      class: classes.input,
      type: 'number',
      value: String(quantity),
    });
    this.#minus = tag({ tag: 'div', class: classes.minus, text: '-' });
    this.#plus = tag({ tag: 'div', class: classes.plus, text: '+' });

    this.#minus.node.addEventListener('click', this.#minusHandler);
    this.#plus.node.addEventListener('click', this.#plusHandler);
    this.#input.node.addEventListener('change', callback);

    this.#setMinus();
    this.node.append(this.#minus.node, this.#input.node, this.#plus.node);
  }

  #minusHandler = () => {
    this.#input.node.value = String(parseInt(this.#input.node.value, 10) - 1);
    this.#setMinus();
  };

  #plusHandler = () => {
    this.#input.node.value = String(parseInt(this.#input.node.value, 10) + 1);
    this.#setMinus();
  };

  #setMinus = () => {
    if (parseInt(this.#input.node.value, 10) <= 1) {
      this.#minus.node.classList.add(classes.disable);
    } else {
      this.#minus.node.classList.remove(classes.disable);
    }
  };
}
