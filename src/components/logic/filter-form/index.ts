import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import Accordion, { AccordionState } from '@Src/components/ui/accordion';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import CheckBox from '@Src/components/ui/checkbox';
import RangeSlider from '@Src/components/ui/range-slider';
import Products, { AttrName, FilterAttributes } from '@Src/controllers/products';
import State from '@Src/state';
import classes from './style.module.scss';

const SHOWED_FILTER = [
  AttrName.BRAND,
  AttrName.AGE_FROM,
  AttrName.MIN_PLAYER_COUNT,
  AttrName.MAX_PLAYER_COUNT,
];

type FilterSettings = {
  brandsChecked: boolean[];
  ageChecked: boolean[];
  minNumberOfPlayerStart: number;
  minNumberOfPlayerEnd: number;
  maxNumberOfPlayerStart: number;
  maxNumberOfPlayerEnd: number;
};

const FILTERS_STATE_KEY = 'catalogue-filtres';
export default class FilterForm extends BaseElement<HTMLFormElement> {
  #brandsCheckBoxes!: CheckBox[];

  #rangeSliderMin!: RangeSlider;

  #rangeSliderMax!: RangeSlider;

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
        const filterState = JSON.parse(
          State.getInstance().getItem(FILTERS_STATE_KEY) ?? '{}',
        ) as FilterSettings;
        if (filterState.ageChecked) {
          this.#restoreDefaultFilters(filterState);
        } else {
          this.#resetDefaultFilters();
        }
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
                .map((brand) => new CheckBox({ class: classes.filterCheckbox }, brand, false))),
            )
          : tag({ tag: 'span' }),

        // Min number of players
        this.#filterOptions[AttrName.MIN_PLAYER_COUNT_START]
          ? tag(
              { tag: 'div', class: classes.rangeSliderContainer },
              tag<HTMLParagraphElement>({
                tag: 'p',
                class: classes.rangeSliderCatption,
                text: 'Min number of players',
              }),
              (this.#rangeSliderMin = new RangeSlider(
                this.#filterOptions[AttrName.MIN_PLAYER_COUNT_START],
                this.#filterOptions[AttrName.MIN_PLAYER_COUNT_END],
                classes.rangeSlider,
              )),
            )
          : tag({ tag: 'span' }),

        // Max number of players
        this.#filterOptions[AttrName.MIN_PLAYER_COUNT_START]
          ? tag(
              { tag: 'div', class: classes.rangeSliderContainer },
              tag<HTMLParagraphElement>({
                tag: 'p',
                class: classes.rangeSliderCatption,
                text: 'Max number of players',
              }),
              (this.#rangeSliderMax = new RangeSlider(
                this.#filterOptions[AttrName.MAX_PLAYER_COUNT_START],
                this.#filterOptions[AttrName.MAX_PLAYER_COUNT_END],
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
            this.#resetDefaultFilters();
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

  #resetDefaultFilters = () => {
    this.#brandsCheckBoxes.forEach((cb: CheckBox) => {
      const cbCopy = cb;
      cbCopy.checked = false;
    });
    this.#rangeSliderMin.minValue = this.#filterOptions[AttrName.MIN_PLAYER_COUNT_START];
    this.#rangeSliderMin.maxValue = this.#filterOptions[AttrName.MIN_PLAYER_COUNT_END];
    this.#rangeSliderMax.minValue = this.#filterOptions[AttrName.MAX_PLAYER_COUNT_START];
    this.#rangeSliderMax.maxValue = this.#filterOptions[AttrName.MAX_PLAYER_COUNT_END];
    this.#ageCheckBoxes.forEach((cb: CheckBox) => {
      const cbCopy = cb;
      cbCopy.checked = false;
    });
    State.getInstance().setItem(FILTERS_STATE_KEY, JSON.stringify(this.#getFilterSettings()));
  };

  #restoreDefaultFilters = (filterState: FilterSettings) => {
    this.#brandsCheckBoxes.forEach((cb: CheckBox, i) => {
      const cbCopy = cb;
      cbCopy.checked = filterState.brandsChecked[i];
    });
    this.#rangeSliderMin.minValue = filterState.minNumberOfPlayerStart;
    this.#rangeSliderMin.maxValue = filterState.minNumberOfPlayerEnd;
    this.#rangeSliderMax.minValue = filterState.maxNumberOfPlayerStart;
    this.#rangeSliderMax.maxValue = filterState.maxNumberOfPlayerEnd;
    this.#ageCheckBoxes.forEach((cb: CheckBox, i) => {
      const cbCopy = cb;
      cbCopy.checked = filterState.ageChecked[i];
    });
  };

  getFilterValues = (): Promise<FilterAttributes> =>
    this.#availableFilterAttributes.then(() => ({
      [AttrName.BRAND]: this.#brandsCheckBoxes
        ?.filter((checkBox) => checkBox.checked)
        .map((checkBox) => checkBox.labelElement.node.textContent ?? ''),
      [AttrName.MIN_PLAYER_COUNT_START]: this.#rangeSliderMin?.minValue,
      [AttrName.MIN_PLAYER_COUNT_END]: this.#rangeSliderMin?.maxValue,
      [AttrName.MAX_PLAYER_COUNT_START]: this.#rangeSliderMax?.minValue,
      [AttrName.MAX_PLAYER_COUNT_END]: this.#rangeSliderMax?.maxValue,
      [AttrName.AGE_FROM]: this.#ageCheckBoxes
        ?.filter((checkBox) => checkBox.checked)
        .map((checkBox) => Number(checkBox.labelElement.node.textContent) ?? Infinity),
    }));

  #getFilterSettings = (): FilterSettings => ({
    brandsChecked: this.#brandsCheckBoxes.map((cb: CheckBox) => cb.checked),
    ageChecked: this.#ageCheckBoxes.map((cb: CheckBox) => cb.checked),
    minNumberOfPlayerStart: this.#rangeSliderMin.minValue,
    minNumberOfPlayerEnd: this.#rangeSliderMin.maxValue,
    maxNumberOfPlayerStart: this.#rangeSliderMax.minValue,
    maxNumberOfPlayerEnd: this.#rangeSliderMax.maxValue,
  });

  #viewButtonHandler = () => {
    this.#onViewBtnClick();
    State.getInstance().setItem(FILTERS_STATE_KEY, JSON.stringify(this.#getFilterSettings()));
  };
}
