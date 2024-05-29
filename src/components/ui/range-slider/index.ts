import BaseElement from '@Src/components/common/base-element';
import classes from './style.module.scss';

export default class RangeSlider extends BaseElement<HTMLElement> {
  minValue: number;

  maxValue: number;

  #start: number;

  #end: number;

  #minInput!: BaseElement<HTMLInputElement>;

  #maxInput!: BaseElement<HTMLInputElement>;

  constructor(className: string, start: number, end: number) {
    super({ tag: 'div', class: className });
    this.node.classList.add(classes.rangeSlider);

    this.#start = start;
    this.#end = end;
    this.minValue = start;
    this.maxValue = end;

    this.#createInputs();
  }

  #createInputs = () => {
    this.#minInput = new BaseElement<HTMLInputElement>({
      tag: 'input',
      min: String(this.#start),
      max: String(this.#end),
      step: '1',
      value: String(this.minValue),
      class: classes.inputMin,
    });
    this.#maxInput = new BaseElement<HTMLInputElement>({
      tag: 'input',
      min: String(this.#start),
      max: String(this.#end),
      step: '1',
      value: String(this.maxValue),
      class: classes.inputMax,
    });
    const wrapper = new BaseElement<HTMLElement>(
      {
        tag: 'div',
        class: classes.inputsWrapper,
      },
      this.#minInput,
      this.#maxInput,
    );
    this.node.append(wrapper.node);
  };
}
