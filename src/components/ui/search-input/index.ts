import BaseElement, { ElementProps } from '@Src/components/common/base-element';
import classes from './style.module.scss';

type SearchInputProps = Omit<ElementProps<HTMLInputElement>, 'tag'>;
type SearchInputFieldProps = Omit<SearchInputProps, 'class'>;

export default class SearchInput extends BaseElement<HTMLElement> {
  #inputField!: BaseElement<HTMLInputElement>;

  #clearButton!: BaseElement<HTMLButtonElement>;

  #onChangeCb: () => void;

  constructor(props: SearchInputProps, onChangeCb: () => void) {
    super({ tag: 'div', class: props.class });
    this.node.classList.add(classes.searchInput);
    this.#onChangeCb = onChangeCb;

    this.#showContent(props as SearchInputFieldProps);
    this.#addEventListeners();
  }

  #addEventListeners = () => {
    this.#clearButton.node.addEventListener('click', this.#clearInputField);
    this.#inputField.node.addEventListener('change', this.#onChangeCb);
  };

  #clearInputField = () => {
    this.#inputField.node.value = '';
    this.#onChangeCb();
  };

  get value() {
    return this.#inputField.node.value;
  }

  #showContent = (props: SearchInputFieldProps) => {
    this.node.append(
      new BaseElement<HTMLDivElement>({
        tag: 'div',
        class: classes.inputFieldIcon,
        ...props,
      }).node,
      (this.#inputField = new BaseElement<HTMLInputElement>({
        tag: 'input',
        placeholder: 'Search...',
        class: classes.inputField,
        ...props,
      })).node,
      (this.#clearButton = new BaseElement<HTMLButtonElement>({
        tag: 'button',
        type: 'button',
        class: classes.clearButton,
      })).node,
    );
  };
}
