import { FilterAttributes } from '@Src/controllers/products';
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
};

const getProductByKey = (key: string) =>
  apiRoot.apiBuilder.productProjections().withKey({ key }).get().execute();

const getProductById = (id: string) =>
  apiRoot.apiBuilder.productProjections().withId({ ID: id }).get().execute();

const getProducts = (options: ProductGetOptions) => {
  const { categoryId, sortingType, search, filter } = options;
  console.log('Filter: --------------');
  console.log(filter); // todo: find how add filter parameters to request!!! important
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
        filter: ['variants.attributes.brand:"Days of Wonder"'], // todo: filter by all brands and many params

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
