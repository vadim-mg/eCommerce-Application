import BaseElement from '@Src/components/common/base-element';
import tag from '@Src/components/common/tag';
import Accordion, { AccordionState } from '@Src/components/ui/accordion';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import CheckBox from '@Src/components/ui/checkbox';
import RangeSlider from '@Src/components/ui/range-slider';
import classes from './style.module.scss';

type FilterOptions = {
  brands: string[];
  minNumberOfPlayers: number;
  maxNumberOfPlayers: number;
  age: number[];
  onViewBtnClick: () => void;
};

export default class FilterForm extends BaseElement<HTMLFormElement> {
  #brandsCheckBoxes!: CheckBox[];

  #ageCheckBoxes!: CheckBox[];

  #filterOptions: FilterOptions;

  constructor(filterOptions: FilterOptions) {
    super({ tag: 'form', class: classes.filterForm });
    this.#filterOptions = filterOptions;
    this.#createComponent();
    this.#addEventListeners();
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
          ...(this.#brandsCheckBoxes = this.#filterOptions.brands.map(
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
          this.#filterOptions.minNumberOfPlayers,
          this.#filterOptions.maxNumberOfPlayers,
          classes.rangeSlider,
        ),

        // age filter
        new Accordion(
          'Age from',
          AccordionState.OPEN,
          classes.brandAccordion,
          ...(this.#ageCheckBoxes = this.#filterOptions.age.map(
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
    console.log(this.#filterOptions.age);
  };

  #viewButtonHandler = () => {
    this.#filterOptions.onViewBtnClick();
  };
}
