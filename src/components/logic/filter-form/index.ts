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

  #ageCheckBoxes!: CheckBox[];

  #filterOptions!: FilterAttributes;

  #onViewBtnClick: () => void;

  constructor(products: Products, onViewBtnClick: () => void) {
    super({ tag: 'form', class: classes.filterForm });
    this.#onViewBtnClick = onViewBtnClick;

    products.getFilterAttributes(SHOWED_FILTER).then((filterAttrs) => {
      this.#filterOptions = filterAttrs;

      this.#createComponent();
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
              ...(this.#brandsCheckBoxes = this.#filterOptions[AttrName.BRAND].map(
                (brand) => new CheckBox({ class: classes.filterCheckbox }, brand, false),
              )),
            )
          : tag({ tag: 'span' }),

        // Number of players
        ...(this.#filterOptions[AttrName.MIN_PLAYER_COUNT]
          ? [
              tag<HTMLParagraphElement>({
                tag: 'p',
                class: classes.rangeSliderCatption,
                text: 'Number of players',
              }),
              new RangeSlider(
                this.#filterOptions[AttrName.MIN_PLAYER_COUNT],
                this.#filterOptions[AttrName.MAX_PLAYER_COUNT],
                classes.rangeSlider,
              ),
            ]
          : [tag({ tag: 'span' })]),

        // age filter
        this.#filterOptions[AttrName.AGE_FROM].length
          ? new Accordion(
              'Age from',
              AccordionState.OPEN,
              classes.brandAccordion,
              ...(this.#ageCheckBoxes = this.#filterOptions[AttrName.AGE_FROM].map(
                (age) => new CheckBox({ class: classes.filterCheckbox }, age.toString(), false),
              )),
            )
          : tag({ tag: 'span' }),

        // buttons
        tag<HTMLDivElement>(
          { tag: 'div', class: classes.buttons },
          new Button({ text: 'Reset' }, ButtonClasses.CATEGORY, this.#resetButtonHandler),
          new Button({ text: 'View products' }, ButtonClasses.CATEGORY, this.#viewButtonHandler),
        ),
      ).node,
    );
  };

  #addEventListeners = () => {
    console.log(this.#brandsCheckBoxes);
  };

  #resetButtonHandler = () => {
    console.log('Reset all filters by default');
    console.log(this.#filterOptions[AttrName.AGE_FROM]);
  };

  #viewButtonHandler = () => {
    this.#onViewBtnClick();
  };
}
