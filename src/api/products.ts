import { AttrName, FilterAttributes } from '@Src/controllers/products';
import apiRoot from './api-root';

// docs.commercetools.com/api/projects/productProjections#get-productprojection-by-key

export enum SortingType {
  'name-asc' = `name.en-GB asc`,
  'price asc' = 'price asc',
  'price desc' = 'price desc',
}

export type ProductGetOptions = {
  categoryId?: string;
  sortingType?: SortingType;
  search?: string;
  filter?: FilterAttributes;
  limit?: number;
  offset?: number;
  isClear?: boolean;
};

const getProductByKey = (key: string) =>
  apiRoot.apiBuilder.productProjections().withKey({ key }).get().execute();

const getProductById = (id: string) =>
  apiRoot.apiBuilder.productProjections().withId({ ID: id }).get().execute();

const getProducts = (options: ProductGetOptions) => {
  const { categoryId, sortingType, search, filter, limit = 9, offset } = options;

  const filteredBrans = filter?.[AttrName.BRAND]?.length ? filter?.[AttrName.BRAND] : [];

  const filters = [
    ...(filteredBrans.length
      ? [
          `variants.attributes.${AttrName.BRAND}:${filteredBrans.map((val) => `"${val}"`).join(',')}`,
        ]
      : []),
    `variants.attributes.${AttrName.MIN_PLAYER_COUNT}: range(${filter?.[AttrName.MIN_PLAYER_COUNT_START]} to ${filter?.[AttrName.MIN_PLAYER_COUNT_END]})`,
    `variants.attributes.${AttrName.MAX_PLAYER_COUNT}: range(${filter?.[AttrName.MAX_PLAYER_COUNT_START]} to ${filter?.[AttrName.MAX_PLAYER_COUNT_END]})`,
    `variants.attributes.age-from: range(${filter?.[AttrName.AGE_FROM]?.[0] ?? '0'} to 130)`,
  ];

  return apiRoot.apiBuilder
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit,

        ...(search ? { 'text.en-GB': `"${search}"` } : {}),
        fuzzy: true,
        // fuzzyLevel: 0,
        markMatchingVariants: false, //   https://docs.commercetools.com/api/projects/products-search#query-result-and-marked-matching-variants

        ...(categoryId
          ? {
              'filter.query': [`categories.id:"${categoryId}"`],
            }
          : {}),

        sort: sortingType,

        ...{ filter: filters },

        offset,
      },
    })
    .execute();
};

const getAllProducts = () =>
  apiRoot.apiBuilder
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit: 100,
      },
    })
    .execute();

export default { getProductById, getProductByKey, getProducts, getAllProducts };
