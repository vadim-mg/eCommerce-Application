import BaseElement from '@Src/components/common/base-element';
import classes from './style.module.scss';

export type ChangeCallback = (val: string) => void;

export default class Select extends BaseElement<HTMLSelectElement> {
  #labelName: string;

  #input!: BaseElement<HTMLSelectElement>;

  #options!: string[];

  #onChangeCallback: ChangeCallback;

  constructor(labelName: string, list: string[], onChangeCallback: ChangeCallback) {
    super({ tag: 'div', class: [classes.select] });
    this.#labelName = labelName;
    this.#onChangeCallback = onChangeCallback;
    this.#newList(list);
    this.#addEventListener();
  }

  get selectedValue() {
    return this.#input.node.options[this.#input.node.selectedIndex].value;
  }

  set selectedValue(value: string) {
    this.#input.node.selectedIndex = this.#options.indexOf(value);
  }

  #addEventListener = () => {
    this.#input.node.addEventListener('change', () => {
      this.#onChange(this.#input.node.options[this.#input.node.selectedIndex].value);
    });
  };

  #onChange(val: string): void {
    this.#onChangeCallback(val);
  }

  #newList(list: string[]): void {
    this.node.innerHTML = '';
    this.#options = list;
    this.#input = new BaseElement<HTMLSelectElement>({
      tag: 'select',
      class: classes.input,
    });

    this.#options.forEach((val) => {
      const option = new BaseElement<HTMLOptionElement>({
        tag: 'option',
        value: val,
        textContent: `${val}`,
      }).node;
      this.#input.node.append(option);
    });

    this.node.append(
      new BaseElement<HTMLLabelElement>({
        tag: 'label',
        text: this.#labelName,
        class: classes.label,
      }).node,
      this.#input.node,
    );
  }
}
