import apiRoot from './api-root';

// docs.commercetools.com/api/projects/productProjections#get-productprojection-by-key

const getProductByKey = (key: string) =>
  apiRoot.apiBuilder.productProjections().withKey({ key }).get().execute();

const getProductById = (id: string) =>
  apiRoot.apiBuilder.productProjections().withId({ ID: id }).get().execute();

const getProducts = (categoryId?: string) =>
  apiRoot.apiBuilder
    .productProjections()
    .search()
    .get({
      queryArgs: {
        limit: 10,
        ...(categoryId ? { 'filter.query': `categories.id:"${categoryId}"` } : {}),
      },
    })
    .execute();

export { getProductById, getProductByKey, getProducts };
