import BaseElement from '@Src/components/common/base-element';
import classes from './style.module.scss';

export default class RangeSlider extends BaseElement<HTMLElement> {
  #start: number;

  #end: number;

  #minInput!: BaseElement<HTMLInputElement>;

  #maxInput!: BaseElement<HTMLInputElement>;

  #thumbLeft!: BaseElement<HTMLElement>;

  #thumbLeftText!: BaseElement<HTMLElement>;

  #thumbRight!: BaseElement<HTMLElement>;

  #thumbRightText!: BaseElement<HTMLElement>;

  #rangeBetween!: BaseElement<HTMLElement>;

  constructor(start: number, end: number, className: string) {
    super({ tag: 'div', class: className });
    this.node.classList.add(classes.wrapperRangeSlider);

    this.#start = start;
    this.#end = end;

    this.#create();
    this.#setStartValue();
    this.#setEndValue();
    this.#setEvents();
  }

  get minValue(): number {
    return parseInt(this.#minInput.node.value, 10);
  }

  set minValue(value: number) {
    this.#minInput.node.value = value?.toString();
    this.#setStartValue();
  }

  get maxValue(): number {
    return parseInt(this.#maxInput.node.value, 10);
  }

  set maxValue(value: number) {
    this.#maxInput.node.value = value?.toString();
    this.#setEndValue();
  }

  #create = () => {
    this.#minInput = new BaseElement<HTMLInputElement>({
      tag: 'input',
      type: 'range',
      id: 'input-min',
      min: String(this.#start),
      max: String(this.#end),
      step: '1',
      value: String(this.#start),
      class: classes.inputMin,
    });
    this.#maxInput = new BaseElement<HTMLInputElement>({
      tag: 'input',
      type: 'range',
      id: 'input-max',
      min: String(this.#start),
      max: String(this.#end),
      step: '1',
      value: String(this.#end),
      class: classes.inputMax,
    });

    const trackWrapper = new BaseElement<HTMLElement>(
      {
        tag: 'div',
        class: classes.trackWrapper,
      },
      new BaseElement<HTMLElement>({
        tag: 'div',
        class: classes.track,
      }),
      (this.#rangeBetween = new BaseElement<HTMLElement>({
        tag: 'div',
        class: classes.rangeBetween,
      })),
      (this.#thumbLeft = new BaseElement<HTMLElement>(
        {
          tag: 'div',
          class: [classes.thumb, classes.left],
        },
        (this.#thumbLeftText = new BaseElement<HTMLElement>({
          tag: 'div',
          class: [classes.thumb, classes.thumbText],
        })),
      )),
      (this.#thumbRight = new BaseElement<HTMLElement>(
        {
          tag: 'div',
          class: [classes.thumb, classes.right],
        },
        (this.#thumbRightText = new BaseElement<HTMLElement>({
          tag: 'div',
          class: [classes.thumb, classes.thumbText],
        })),
      )),
      this.#createScale(),
    );

    const wrapper = new BaseElement<HTMLElement>(
      {
        tag: 'div',
        class: classes.rangeSlider,
      },
      this.#minInput,
      this.#maxInput,
      trackWrapper,
    );
    this.node.append(wrapper.node);
  };

  #createScale = (): BaseElement<HTMLUListElement> => {
    const scale = new BaseElement<HTMLUListElement>({ tag: 'ul', class: classes.scale });
    let start = this.#start;
    for (let i = 0; i < this.#end - this.#start + 1; i += 1) {
      const li = new BaseElement<HTMLLIElement>({
        tag: 'li',
        class: classes.scaleItem,
        text: String(start),
      });
      scale.node.append(li.node);
      start += 1;
    }
    return scale;
  };

  #setStartValue = () => {
    const maximum = Math.min(
      parseInt(this.#minInput.node.value, 10),
      parseInt(this.#maxInput.node.value, 10) - 1,
    );
    const percent =
      ((maximum - Number(this.#minInput.node.min)) /
        (Number(this.#minInput.node.max) - Number(this.#minInput.node.min))) *
      100;
    this.#thumbLeft.node.style.left = `${percent}%`;
    this.#rangeBetween.node.style.left = `${percent}%`;

    if (Number(this.#minInput.node.value) >= Number(this.#maxInput.node.value) - 1) {
      this.#minInput.node.value = String(+this.#maxInput.node.value - 1);
    }

    this.#thumbLeftText.node.innerHTML = this.#minInput.node.value;
  };

  #setEndValue = () => {
    const minimum = Math.max(
      parseInt(this.#maxInput.node.value, 10),
      parseInt(this.#minInput.node.value, 10) + 1,
    );
    const percent =
      ((minimum - Number(this.#maxInput.node.min)) /
        (Number(this.#maxInput.node.max) - Number(this.#maxInput.node.min))) *
      100;
    this.#thumbRight.node.style.right = `${100 - percent}%`;
    this.#rangeBetween.node.style.right = `${100 - percent}%`;

    if (Number(this.#maxInput.node.value) <= Number(this.#minInput.node.value) + 1) {
      this.#maxInput.node.value = String(+this.#minInput.node.value + 1);
    }

    this.#thumbRightText.node.innerHTML = this.#maxInput.node.value;
  };

  #setEvents = () => {
    this.#minInput.node.addEventListener('input', () => this.#setStartValue());
    this.#maxInput.node.addEventListener('input', () => this.#setEndValue());
  };
}
