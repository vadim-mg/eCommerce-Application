import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import Accordion, { AccordionState } from '@Src/components/ui/accordion';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import CheckBox from '@Src/components/ui/checkbox';
import RangeSlider from '@Src/components/ui/range-slider';
import Products, { AttrName, FilterAttributes } from '@Src/controllers/products';
import classes from './style.module.scss';

const SHOWED_FILTER = [
  AttrName.BRAND,
  AttrName.AGE_FROM,
  AttrName.MIN_PLAYER_COUNT,
  AttrName.MAX_PLAYER_COUNT,
];

export default class FilterForm extends BaseElement<HTMLFormElement> {
  #brandsCheckBoxes!: CheckBox[];

  #rangeSlider!: RangeSlider;

  #ageCheckBoxes!: CheckBox[];

  #filterOptions!: FilterAttributes;

  #onViewBtnClick: () => void;

  #availableFilterAttributes: Promise<void>;

  constructor(products: Products, onViewBtnClick: () => void) {
    super({ tag: 'form', class: classes.filterForm });
    this.#onViewBtnClick = onViewBtnClick;

    this.#availableFilterAttributes = products
      .getFilterAttributes(SHOWED_FILTER)
      .then((filterAttrs) => {
        this.#filterOptions = filterAttrs;

        this.#createComponent();
        this.#setDefaultFilters();
        this.#addEventListeners();
      });
  }

  #createComponent = () => {
    this.node.append(
      tag<HTMLDivElement>({
        tag: 'div',
        class: classes.formHeader,
        text: 'Filters',
      }).node,
      // internal container
      tag<HTMLDivElement>(
        { tag: 'div', class: classes.container },

        // brands checkboxes
        this.#filterOptions[AttrName.BRAND].length
          ? new Accordion(
              'Brands',
              AccordionState.OPEN,
              classes.brandAccordion,
              ...(this.#brandsCheckBoxes = this.#filterOptions[AttrName.BRAND]
                .sort()
                .map((brand) => new CheckBox({ class: classes.filterCheckbox }, brand, true))),
            )
          : tag({ tag: 'span' }),

        // Number of players
        this.#filterOptions[AttrName.MIN_PLAYER_COUNT]
          ? tag(
              { tag: 'div', class: classes.rangeSliderContainer },
              tag<HTMLParagraphElement>({
                tag: 'p',
                class: classes.rangeSliderCatption,
                text: 'Number of players',
              }),
              (this.#rangeSlider = new RangeSlider(
                this.#filterOptions[AttrName.MIN_PLAYER_COUNT],
                this.#filterOptions[AttrName.MAX_PLAYER_COUNT],
                classes.rangeSlider,
              )),
            )
          : tag({ tag: 'span' }),

        // age filter
        this.#filterOptions[AttrName.AGE_FROM].length
          ? new Accordion(
              'Age from',
              AccordionState.OPEN,
              classes.brandAccordion,
              ...(this.#ageCheckBoxes = this.#filterOptions[AttrName.AGE_FROM]
                .sort((a, b) => Number(a) - Number(b))
                .map(
                  (age) => new CheckBox({ class: classes.filterCheckbox }, age.toString(), false),
                )),
            )
          : tag({ tag: 'span' }),

        // buttons
        tag<HTMLDivElement>(
          { tag: 'div', class: classes.buttons },
          new Button({ text: 'Reset' }, ButtonClasses.CATEGORY, () => {
            this.#setDefaultFilters();
            this.#onViewBtnClick();
          }),
          new Button({ text: 'View products' }, ButtonClasses.CATEGORY, this.#viewButtonHandler),
        ),
      ).node,
    );
  };

  #addEventListeners = () => {
    this.#ageCheckBoxes.forEach((checkbox) =>
      checkbox.node.addEventListener('change', (event: Event) => {
        const eventTarget = event.target as HTMLInputElement;

        if (eventTarget.checked) {
          this.#ageCheckBoxes.forEach((cb: CheckBox) => {
            const cbCopy = cb;
            cbCopy.checked = false;
          });
          eventTarget.checked = true;
        }
      }),
    );
  };

  #setDefaultFilters = () => {
    this.#brandsCheckBoxes.forEach((cb: CheckBox) => {
      const cbCopy = cb;
      cbCopy.checked = true;
    });
    this.#rangeSlider.minValue = 4;
    this.#rangeSlider.maxValue = 6;
    this.#ageCheckBoxes.forEach((cb: CheckBox, index) => {
      const cbCopy = cb;
      cbCopy.checked = !index; // first must be selected
    });
  };

  getFilterSettings = (): Promise<FilterAttributes> =>
    this.#availableFilterAttributes.then(() => ({
      [AttrName.BRAND]: this.#brandsCheckBoxes
        ?.filter((checkBox) => checkBox.checked)
        .map((checkBox) => checkBox.labelElement.node.textContent ?? ''),
      [AttrName.MIN_PLAYER_COUNT]: this.#rangeSlider?.minValue,
      [AttrName.MAX_PLAYER_COUNT]: this.#rangeSlider?.maxValue,
      [AttrName.AGE_FROM]: this.#ageCheckBoxes
        ?.filter((checkBox) => checkBox.checked)
        .map((checkBox) => Number(checkBox.labelElement.node.textContent) ?? Infinity),
    }));

  #viewButtonHandler = () => {
    this.#onViewBtnClick();
  };
}
