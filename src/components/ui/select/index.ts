import BaseElement from '@Src/components/common/base-element';
import classes from './style.module.scss';

export type ChangeCallback = (val: string) => void;

export default class Select extends BaseElement<HTMLSelectElement> {
  #labelName: string;

  #input!: BaseElement<HTMLSelectElement>;

  #options: string[];

  #onChangeCallback: ChangeCallback;

  // if no need label set labelName=''
  constructor(labelName: string, list: string[], onChangeCallback: ChangeCallback) {
    super({ tag: 'div', class: [classes.component] });
    this.#options = list;
    this.#labelName = labelName;
    this.#onChangeCallback = onChangeCallback;

    this.#input = new BaseElement<HTMLSelectElement>(
      {
        tag: 'select',
        class: classes.selectInput,
      },
      ...this.#options.map(
        (optionName) =>
          new BaseElement<HTMLOptionElement>({
            tag: 'option',
            value: optionName,
            textContent: `${optionName}`,
          }),
      ),
    );

    this.#renderList();
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

  #renderList(): void {
    this.node.innerHTML = '';

    const inputWrapper = new BaseElement<HTMLLabelElement>(
      {
        tag: 'div',
        class: classes.select,
      },
      this.#input,
    );

    inputWrapper.node.addEventListener('click', () => {
      this.#input.node.showPicker();
    });

    if (this.#labelName.length) {
      this.node.append(
        new BaseElement<HTMLLabelElement>({
          tag: 'label',
          text: this.#labelName,
          class: classes.label,
        }).node,
      );
    }

    this.node.append(inputWrapper.node);
  }
}
