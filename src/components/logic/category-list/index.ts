import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import { Category } from '@commercetools/platform-sdk';
import tag from '@Src/components/common/tag';
import Button, { ButtonClasses } from '@Src/components/ui/button';
import productCategories from '@Src/controllers/categories';
import classes from './style.module.scss';

type CategoryListProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;

type SimpleCategory = Pick<Category, 'id' | 'name'>;
export default class CategoryList extends BaseElement<HTMLDivElement> {
  #categories!: [...SimpleCategory[]];

  #currentCategoryId: string; // if empty string, then current select is all categories

  #onSelectCb: (id: string) => void;

  #allButtons!: BaseElement<HTMLElement>[];

  constructor(props: CategoryListProps, onSelectCb: (id: string) => void, currentCategoryId = '') {
    super({ tag: 'div', ...props });
    this.#onSelectCb = onSelectCb;
    this.#currentCategoryId = currentCategoryId;
    this.node.classList.add(classes.categoryContainer);

    this.#showCategories();
  }

  get currentCategoryId(): string {
    return this.#currentCategoryId;
  }

  #showCategories = async () => {
    try {
      this.#categories = [
        productCategories.CATEGORY_ALL,
        ...(await productCategories.getCategories()),
      ];

      this.#allButtons = this.#categories.map(
        (category) =>
          new Button(
            {
              text: `${category.name[process.env.LOCALE]}`,
              id: category.id,
            },
            [
              ButtonClasses.CATEGORY,
              ...(category.id === this.#currentCategoryId ? [ButtonClasses.CURRENT_CATEGORY] : []),
            ],
            this.#onSelectCategory,
          ),
      );

      this.node.append(
        tag(
          { tag: 'ul', class: classes.categoryList },
          ...this.#allButtons.map((categoryButton) =>
            tag(
              {
                tag: 'li',
                class: classes.categoryItem,
              },
              categoryButton,
            ),
          ),
        ).node,
      );
    } catch (error) {
      console.log(error);
    }
  };

  #onSelectCategory = (event: Event) => {
    const eventTarget = event.target as HTMLButtonElement;
    this.#currentCategoryId = eventTarget.id;
    this.#onSelectCb(eventTarget.id);
    this.#allButtons.forEach((button) => {
      const btn = button as Button;
      (btn as Button).currentStatus = btn.node.id === this.#currentCategoryId;
    });
  };
}
