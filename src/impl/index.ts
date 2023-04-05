import { CategoriesApi } from "../../dist/api/categories/types";
import { ApiImplementation } from "../../dist/types";
import { categoriesServiceImpl } from "./categories";
import { SubCategoriesApi } from "../../dist/api/subCategories/types";
// import { ApiImplementation } from "../../dist/types";
import { subcategoriesServiceImpl } from "./subcategories";

export class ServiceImplementation implements ApiImplementation {
	// appointments: AppointmentsApi | undefined;
	categories: CategoriesApi = categoriesServiceImpl;
	subCategories: SubCategoriesApi = subcategoriesServiceImpl;
}
