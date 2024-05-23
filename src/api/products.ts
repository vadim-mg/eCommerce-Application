import apiRoot from './api-root';

// docs.commercetools.com/api/projects/productProjections#get-productprojection-by-key

const getProductByKey = (key: string) =>
  apiRoot.apiBuilder.productProjections().withKey({ key }).get().execute();

const getProductById = (id: string) =>
  apiRoot.apiBuilder.productProjections().withId({ ID: id }).get().execute;

export { getProductById, getProductByKey };
