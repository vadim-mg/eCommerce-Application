import BaseElement from '@Src/components/common/base-element';
import classes from './style.module.scss';

export type ChangeCallback = (val: string) => void;

type SelectOption = { key: string; value: string };

export default class SelectWithKey extends BaseElement<HTMLSelectElement> {
  #labelName: string;

  #input!: BaseElement<HTMLSelectElement>;

  #options: SelectOption[];

  #onChangeCallback: ChangeCallback;

  #value: SelectOption;

  // if no need label set labelName=''
  constructor(labelName: string, list: SelectOption[], onChangeCallback: ChangeCallback) {
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
        (option) =>
          new BaseElement<HTMLOptionElement>({
            tag: 'option',
            value: option.key,
            textContent: option.value,
          }),
      ),
    );
    this.#value = {
      key: this.#input.node.value,
      value: this.#input.node.value,
    };
    this.#renderList();
    this.#addEventListener();
  }

  get selectedValue() {
    return {
      key: this.#input.node.options[this.#input.node.selectedIndex].value,
      value: this.#input.node.options[this.#input.node.selectedIndex].textContent ?? '',
    };
  }

  set selectedValue(value: SelectOption) {
    this.#input.node.selectedIndex = this.#options.indexOf(value);
    this.#value = value;
  }

  #addEventListener = () => {
    this.#input.node.addEventListener('change', () => {
      this.#value = this.selectedValue;
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

    inputWrapper.node.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains(classes.select)) {
        this.#input.node.showPicker();
        // target.classList.add(classes.selectOpened);
      }
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
