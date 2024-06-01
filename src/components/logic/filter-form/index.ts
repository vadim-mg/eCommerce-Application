import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import Accordion, { AccordionState } from '@Src/components/ui/accordion';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import CheckBox from '@Src/components/ui/checkbox';
import RangeSlider from '@Src/components/ui/range-slider';
import Products, { AttrName } from '@Src/controllers/products';
import classes from './style.module.scss';

type FilterOptions = {
  [AttrName.BRAND]: string[];
  [AttrName.MIN_PLAYER_COUNT]: number;
  [AttrName.MAX_PLAYER_COUNT]: number;
  [AttrName.AGE_FROM]: number[];
};

export default class FilterForm extends BaseElement<HTMLFormElement> {
  #brandsCheckBoxes!: CheckBox[];

  #ageCheckBoxes!: CheckBox[];

  #filterOptions!: FilterOptions;

  #onViewBtnClick: () => void;

  constructor(products: Products, onViewBtnClick: () => void) {
    super({ tag: 'form', class: classes.filterForm });
    this.#onViewBtnClick = onViewBtnClick;

    products.getFilterAttributes().then((filterAttrs) => {
      const brandsSet = filterAttrs[AttrName.BRAND].values();
      const minPlayersCountSet = filterAttrs[AttrName.MIN_PLAYER_COUNT].values();
      const maxPlayersCountSet = filterAttrs[AttrName.MAX_PLAYER_COUNT].values();
      const ageSet = filterAttrs[AttrName.AGE_FROM].values();

      this.#filterOptions = {
        [AttrName.BRAND]: Array.from(brandsSet).sort(),
        [AttrName.MIN_PLAYER_COUNT]: Math.min(...Array.from(minPlayersCountSet)),
        [AttrName.MAX_PLAYER_COUNT]: Math.max(...Array.from(maxPlayersCountSet)),
        [AttrName.AGE_FROM]: Array.from(ageSet).sort(),
      };

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
        new Accordion(
          'Brands',
          AccordionState.OPEN,
          classes.brandAccordion,
          ...(this.#brandsCheckBoxes = this.#filterOptions[AttrName.BRAND].map(
            (brand) => new CheckBox({ class: classes.filterCheckbox }, brand, false),
          )),
        ),

        // Number of players
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

        // age filter
        new Accordion(
          'Age from',
          AccordionState.OPEN,
          classes.brandAccordion,
          ...(this.#ageCheckBoxes = this.#filterOptions[AttrName.AGE_FROM].map(
            (age) => new CheckBox({ class: classes.filterCheckbox }, age.toString(), false),
          )),
        ),

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
