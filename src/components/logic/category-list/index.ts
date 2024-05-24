import BaseElement, { ElementProps } from '@Src/components/common/base-element';

import { Category } from '@commercetools/platform-sdk';
import categoriesApi from '@Src/api/categories';
import tag from '@Src/components/common/tag';
import classes from './style.module.scss';

type CategoryListProps = Omit<ElementProps<HTMLLinkElement>, 'tag'>;

export default class CategoryList extends BaseElement<HTMLDivElement> {
  #categories!: Category[];

  constructor(props: CategoryListProps) {
    super({ tag: 'div', ...props });
    this.node.classList.add(classes.categoryList);
    this.#showCategoryes();
  }

  #showCategoryes = async () => {
    try {
      const resp = await categoriesApi.getCategories();
      this.#categories = resp.body.results;
      console.log(resp.body.results);
      this.node.append(
        tag({ tag: 'ul', text: `categories` }).node,
        ...this.#categories.map(
          (category) =>
            tag({
              tag: 'li',
              text: `${category.name['en-GB']}`,
            }).node,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };
}
