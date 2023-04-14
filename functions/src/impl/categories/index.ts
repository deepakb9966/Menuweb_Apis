import { categoriesService } from "./impl";
import * as t from "../../../dist/api/categories/types";

const service = new categoriesService();

export const categoriesServiceImpl: t.CategoriesApi = {
	postCategoriesCreate: service.create,
	deleteCategoriesDelete: service.delete,
	getCategoriesGet: service.get,
	getCategoriesGetAll: service.getAll,
	putCategoriesUpdate: service.update,
};
