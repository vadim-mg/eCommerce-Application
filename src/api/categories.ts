import apiRoot from './api-root';

const getCategories = () => apiRoot.apiBuilder.categories().get().execute();

export default { getCategories };
