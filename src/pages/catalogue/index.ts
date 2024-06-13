import { SortingType } from '@Src/api/products';
import BaseElement from '@Src/components/common/base-element';
import ContentPage from '@Src/components/common/content-page';
import tag from '@Src/components/common/tag';
import CategoryList from '@Src/components/logic/category-list';
import FilterForm from '@Src/components/logic/filter-form';
import ProductList from '@Src/components/logic/product-list';
import Loader from '@Src/components/ui/loader';
import SearchInput from '@Src/components/ui/search-input';
import SelectWithKey from '@Src/components/ui/selectWithKeys';
import productCategories from '@Src/controllers/categories';
import Products from '@Src/controllers/products';
import Router from '@Src/router';
import { AppRoutes } from '@Src/router/routes';
import classes from './style.module.scss';

const SORT_SETTINGS = [
  {
    key: SortingType['name-asc'],
    value: 'Name (alphabet)',
    default: true,
  },
  {
    key: SortingType['price asc'],
    value: 'Price (asc)',
  },
  {
    key: SortingType['price desc'],
    value: 'Price (desc)',
  },
];

export default class CataloguePage extends ContentPage {
  #content!: BaseElement<HTMLDivElement>;

  #products: Products;

  #productList!: ProductList;

  #filters!: FilterForm;

  #categorySection!: CategoryList;

  #headerH1!: BaseElement<HTMLHeadingElement>;

  #selectedSort: SortingType;

  #searchField!: SearchInput;

  #loader!: Loader;

  constructor(categoryPathPart: string[]) {
    super({ containerTag: 'div', title: 'catalogue page', showBreadCrumbs: true });
    this.#selectedSort = SORT_SETTINGS.find((value) => value.default)?.key ?? SORT_SETTINGS[0].key;
    this.#products = new Products();
    productCategories.getCategories().then(() => {
      const currentCategoryId = productCategories.routeExist(categoryPathPart[0]) ?? '';
      if (categoryPathPart.length && !currentCategoryId) {
        Router.getInstance().route(AppRoutes.NOT_FOUND, false);
      }
      const backendCategoryId =
        !currentCategoryId || currentCategoryId === productCategories.CATEGORY_ALL.id
          ? productCategories.CATEGORY_ALL.id
          : currentCategoryId;
      this.#createContent(backendCategoryId);
      this.container.node.append(this.#content.node);
      this.#renderProductList();
    });
  }

  #renderProductList = async () => {
    this.#productList.showProducts({
      categoryId: this.#categorySection.currentCategoryId,
      sortingType: this.#selectedSort,
      search: this.#searchField.value,
      filter: await this.#filters.getFilterValues(),
      isClear: true,
    });
  };

  #onCategorySelectHandler = (id: string) => {
    Router.getInstance().changeCurrentRoute(productCategories.getById(id)?.key ?? '');
    this.#renderProductList();
    this.#headerH1.node.textContent =
      productCategories.getById(id)?.name?.[process.env.LOCALE] ?? '';
  };

  #createContent = (currentCategoryId: string) => {
    this.#content = tag<HTMLDivElement>(
      {
        tag: 'div',
        class: classes.catalogue,
      },

      // category list
      (this.#categorySection = new CategoryList(
        { class: classes.categories },
        this.#onCategorySelectHandler,
        currentCategoryId,
      )),
      // header
      (this.#headerH1 = tag({
        tag: 'h1',
        text: productCategories.getById(currentCategoryId)?.name?.[process.env.LOCALE],
        class: classes.header,
      })),
      // Search...  sort
      tag(
        { tag: 'div', class: classes.topFieldsBlock },
        (this.#searchField = new SearchInput({}, this.#renderProductList)),
        new BaseElement<HTMLDivElement>(
          { tag: 'div', class: classes.filterField },
          new SelectWithKey('Sort by: ', SORT_SETTINGS, this.#sort),
        ),
      ),
      // main block
      tag(
        { tag: 'main', class: classes.contentSection },
        // filters
        (this.#filters = new FilterForm(this.#products, this.#renderProductList)),
        // products
        (this.#productList = new ProductList(
          { class: classes.products },
          {
            products: this.#products,
            onAddToCartCb: () => {
              this.#loader.show();
              return () => {
                this.header.refreshCountInCartElement();
                this.#loader.hide();
              };
            },
          },
        )),
      ),
      // loader
      (this.#loader = new Loader({})),
    );
  };

  #sort = (val: string) => {
    this.#selectedSort = val as SortingType;
    this.#renderProductList();
  };
}
