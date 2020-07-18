import Api from "./index";

export const getUsers = () => Api.get('/');
export const searchUsers = value => Api.get(`/search?value=${value}`);
