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
};

const getProductByKey = (key: string) =>
  apiRoot.apiBuilder.productProjections().withKey({ key }).get().execute();

const getProductById = (id: string) =>
  apiRoot.apiBuilder.productProjections().withId({ ID: id }).get().execute();

const getProducts = (options: ProductGetOptions) => {
  const { categoryId, sortingType, search } = options;
  return apiRoot.apiBuilder
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit: 9,

        ...(search ? { 'text.en-GB': `"${search}"` } : {}),
        // fuzzy: true,
        // fuzzyLevel: 2,
        // markMatchingVariants: true, //   https://docs.commercetools.com/api/projects/products-search#query-result-and-marked-matching-variants

        ...(categoryId ? { 'filter.query': `categories.id:"${categoryId}"` } : {}),

        sort: sortingType,

        offset: 0,
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
