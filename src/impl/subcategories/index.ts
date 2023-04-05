import { subCategoriesService } from "./impl";
import * as t from "../../../dist/api/subCategories/types";

const service = new subCategoriesService();

export const subcategoriesServiceImpl: t.SubCategoriesApi = {
	postSubCategoriesCreate: service.create,
	deleteSubCategoriesDelete: service.delete,
	getSubCategoriesGet: service.get,
	getSubCategoriesGetAll: service.getAll,
	putSubCategoriesUpdate: service.update,
};
