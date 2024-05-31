import apiRoot from './api-root';

// docs.commercetools.com/api/projects/productProjections#get-productprojection-by-key

export enum SortingType {
  'name-asc' = `name.en-GB asc`,
  'price asc' = 'price asc',
  'price desc' = 'price desc',
}

const getProductByKey = (key: string) =>
  apiRoot.apiBuilder.productProjections().withKey({ key }).get().execute();

const getProductById = (id: string) =>
  apiRoot.apiBuilder.productProjections().withId({ ID: id }).get().execute();

const getProducts = (categoryId?: string, sortingType?: SortingType) =>
  apiRoot.apiBuilder
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit: 10,
        ...(categoryId ? { 'filter.query': `categories.id:"${categoryId}"` } : {}),
        sort: sortingType,
        offset: 0,
      },
    })
    .execute();
export default { getProductById, getProductByKey, getProducts };
