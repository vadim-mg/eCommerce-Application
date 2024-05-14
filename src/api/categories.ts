import apiRoot from './api-root';

const getCategories = () => apiRoot.categories().get().execute();

export default { getCategories };
