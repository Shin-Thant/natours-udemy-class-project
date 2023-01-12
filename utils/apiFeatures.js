// class APIFeatures {
// 	constructor(query, queryObj) {
// 		this.query = query;
// 		this.queryObj = queryObj;
// 	}

// 	filter() {
// 		const queryObj = { ...this.queryObj };
// 		const excludeFields = ["page", "sort", "limit", "fields"];
// 		excludeFields.forEach((el) => delete queryObj[el]);

// 		// filtering
// 		let queryString = JSON.stringify(queryObj);
// 		queryString = queryString.replace(
// 			/\b(gt|gte|lt|lte)\b/,
// 			(matchedWord) => `$${matchedWord}`
// 		);

// 		this.query.find(JSON.parse(queryString));

// 		return this;
// 	}

// 	sort() {
// 		if (this.queryObj.sort) {
// 			const sortBy = this.queryObj.sort.split(",").join(" ");
// 			this.query = this.query.sort(sortBy);
// 		} else {
// 			this.query = this.query.sort("-createdAt");
// 		}

// 		return this;
// 	}

// 	limit() {
// 		if (this.queryObj.fields) {
// 			const selectedFields = this.queryObj.fields.split(",").join(" ");
// 			this.query = this.query.select(selectedFields);
// 		} else {
// 			this.query = this.query.select("-__v");
// 		}

// 		return this;
// 	}

// 	paginate() {
// 		const limit = parseInt(this.queryObj.limit) || 20;
// 		const page = parseInt(this.queryObj.page) || 1;
// 		const skip = (page - 1) * limit;
// 		this.query = this.query.skip(skip).limit(limit);

// 		return this;
// 	}
// }

// !my version
class APIFeatures {
	#model;
	#queryFilter;
	#queryObj;

	constructor(model, queryObj, queryFilter = {}) {
		this.#model = model;
		this.query = null;
		this.#queryFilter = queryFilter;
		this.#queryObj = queryObj;
	}

	#createQuery(query) {
		this.query = this.#model.find({ ...this.#queryFilter, ...query });
	}
	#getQuery(query) {
		if (!this.query) {
			this.query = this.#createQuery(query);

			return this.query;
		}

		return this.query;
	}

	filter() {
		const queryObj = { ...this.#queryObj };
		const excludeFields = ["page", "sort", "limit", "fields"];
		excludeFields.forEach((el) => delete queryObj[el]);

		let queryString = JSON.stringify(queryObj);
		queryString = queryString.replace(
			/\b(gt|gte|lt|lte)\b/,
			(matchedWord) => `$${matchedWord}`
		);

		// let myquery = this.#getQuery(JSON.parse(queryString));
		this.#createQuery(JSON.parse(queryString));

		return this;
	}

	sort() {
		if (this.#queryObj.sort) {
			const sortBy = this.#queryObj.sort.split(",").join(" ");
			this.query = this.#getQuery({}).sort(sortBy);
		} else {
			this.query = this.#getQuery({}).sort("-createdAt");
		}

		return this;
	}

	limit() {
		if (this.#queryObj.fields) {
			const selectedFields = this.#queryObj.fields.split(",").join(" ");
			this.query = this.#getQuery({}).select(selectedFields);
		} else {
			this.query = this.#getQuery({}).select("-__v");
		}

		return this;
	}

	paginate() {
		const limit = parseInt(this.#queryObj.limit) || 20;
		const page = parseInt(this.#queryObj.page) || 1;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

module.exports = APIFeatures;
