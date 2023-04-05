import { Api } from "../../../dist/models";
import * as t from "../../../dist/api/subCategories/types";
import * as v from "../../../dist/validation";
import { db } from "../../db";

export class subCategoriesService{
	private readonly collectionName: string;

	constructor() {
		this.collectionName = "Menu";
		this.getAll = this.getAll.bind(this);
		this.get = this.get.bind(this);
		this.create = this.create.bind(this);
		this.update = this.update.bind(this);
		this.delete = this.delete.bind(this);
	}

	/* *
	 ! Todo: Implement pagination for this service
	*/
	async getAll(
		CategorieID: string,
		limit: number | null | undefined,
		direction: Api.DirectionParamEnum | undefined,
		sortByField: string | null | undefined
	): Promise<t.GetSubCategoriesGetAllResponse> {
		try {
			const categoriesQuerySnap = await db.collectionGroup(`subCategories`).where("CategorieID", "==", CategorieID).get();
			console.log(categoriesQuerySnap.docs)
			const categories: Api.SubCategoriesDto[] = categoriesQuerySnap.docs
				.map((doc: { data: () => any; }) => doc.data())
				.map((json: any) => v.modelApiSubCategoriesDtoFromJson("categories", json));
			console.log("categories", categories)
			return {
				status: 200,
				body: {
					items: categories,
					totalCount: categories.length,
				},
			};
		} catch (error) {
			console.error(error);
			return {
				status: 404,
				body: { message: `something went wrong` }
			}
		}
	}

	async get(id: string): Promise<t.GetSubCategoriesGetResponse> {
		try {
			const categoriesDocSnap = (await db.collectionGroup(`subCategories`).where("id", "==", id).get()).docs[0];
			if (!categoriesDocSnap.exists) {
				throw new Error("no-categories-found");
			}
			const categories = v.modelApiSubCategoriesDtoFromJson("categories", categoriesDocSnap.data());
			console.log(categories)
			return {
				status: 200,
				body: categories,
			};
		} catch (error: any) {
			console.error(error);
			if (error.toString().match("no-categorie-found")) {
				return {
					status: 404,
					body: {
						message: "No categories found with given id",
					},
				};
			}
			return {
				status: 404,
				body: { message: `something went wrong` }
			}
		}
	}

	async create(request: Api.SubCategoriesDto | undefined): Promise<t.PostSubCategoriesCreateResponse> {
		try {
			if (!request) {
				throw new Error("invalid-inputs");
			}
			// if (await this._checkslotExists(request.CategorieName)) {
			// 	throw new Error("CategorieName-exists");

			// }
			const categoriesRef = db.collection(`${this.collectionName}/${request.CategorieID}/subCategories`).doc();
			request.id = categoriesRef.id
			const categoriesRequest = v.modelApiSubCategoriesDtoFromJson("subCategories", request);
			try {
				// const patient = await this._checkUserExists(request.patientId);
				await categoriesRef.set({
					...categoriesRequest,
					Status: true,
				});
				return {
					status: 201,
					body: categoriesRequest,
				};
			} catch (error: any) {
				if (error.toString().match("no-patient-found")) {
					throw new Error("no-patient-found");
				}
				throw error;
			}
		} catch (error: any) {
			console.error(error);
			if (error.toString().match("invalid-inputs")) {
				return {
					status: 422,
					body: {
						message: "Invalid request",
					},
				};
			}

			if (error.toString().match("no-Id-found")) {
				return {
					status: 422,
					body: {
						message: "No id found in request",
					},
				};
			}

			if (error.toString().match("slot-already-bokked")) {
				return {
					status: 422,
					body: {
						message: "appointment already exists with given date and time",
					},
				};
			}
			return {
				status: 404,
				body: { message: `something went wrong` }
			}
		}
	}

	async update(request: Api.SubCategoriesDto | undefined): Promise<t.PutSubCategoriesUpdateResponse> {
		try {
			if (!request) {
				throw new Error("invalid-inputs");
			}

			if (!request.CategorieID) {
				throw new Error("no-CategorieID-found");
			}
			if (!request.id) {
				throw new Error("no-id-found");
			}
			// if (await this._checkslotExists(request.appointmentDate, request.slotTime)) {
			// 	throw new Error("slot-already-bokked");

			// }
			const categoriesRequest = JSON.parse(JSON.stringify(request))
			const categoriesRef = db.collection(`${this.collectionName}/${request.CategorieID}/subCategories`).doc(request.id);
			await categoriesRef.update({
				...categoriesRequest,
			});
			return {
				status: 200,
				body: {
					...categoriesRequest,
				},
			};
		} catch (error: any) {
			console.error(error);
			if (error.toString().match("invalid-inputs")) {
				return {
					status: 422,
					body: {
						message: "Invalid request",
					},
				};
			}

			if (error.toString().match("no-slotId-found")) {
				return {
					status: 422,
					body: {
						message: "No slotId found in request",
					},
				};
			}
			if (error.toString().match("slot-already-bokked")) {
				return {
					status: 422,
					body: {
						message: "appointment already exists with given date and time",
					},
				};
			}

			return {
				status: 422,
				body: {
					message: "no slotId found with given info",
				},
			};
		}
	}

	async delete(CategorieID: string,id: string): Promise<t.DeleteSubCategoriesDeleteResponse> {
		try {
			await this._checkUserExists(CategorieID);
			// console.log("id",id)
			const res = await db.collection(`${this.collectionName}/${CategorieID}/subCategories`).doc(id).delete();
			// const categoriesRef =(await db.collectionGroup(`subCategories`).where("id", "==", id).get()).docs[0].ref
			
			// await categoriesRef.update({
			// 	Status: false,
			// });
			return {
				status: 200,
				body: {
					...res,
					message: `categorie deleted successfully`,
				},
			};
		} catch (error: any) {
			console.error(error);
			return {
				status: 404,
				body: {

					message: "subCategorie already deleted or no subCategorie found",
				},
			};
		}
	}

	private async _checkUserExists(CategorieID: string) {
		const response = await db.collection("Menu").doc(CategorieID).get();
		// console.log("Categorie", response.data())
		if (!response.data()) {
			throw new Error("no-subCategorie-found");
		}
		return response.data();
	}
	// private async _checkslotExists(appointmentDate: string, slotTime: string) {
	// 	try {
	// 		const appD = (await db.collectionGroup(`Appointments`).where("appointmentDate", "==", appointmentDate).get())
	// 		const slTime = (await db.collectionGroup(`Appointments`).where("slotTime", "==", slotTime).get()).docs[0].ref
	// 		console.log("appD:", appD)
	// 		console.log("slTime:", slTime)
	// 		// db.collection("PATIENTS").get().then((querySnapshot) => {
	// 		// querySnapshot.forEach((doc) => {
	// 		// console.log(`${doc.id} => ${doc.data()}`);});
	// 		// });
	// 		if (appD && slTime) {
	// 			return 1
	// 		}

	// 	}
	// 	catch {

	// 		return 0

	// 	}

	// }
}
