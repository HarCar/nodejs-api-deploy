class Helpers {
	static isNullOrEmpty(str) {
		return str === null || str === undefined || str.trim() === ""
	}

	static isNumber(value) {
		return typeof value === "number" && !isNaN(value)
	}

	static isArrayEmpty(arr) {
		return Array.isArray(arr) && arr.length === 0
	}

	static isNull(value) {
		return value === null || value === undefined
	}

	static any(array) {
		if (Array.isArray(array) && array.length > 0) {
			return true
		}
		return false
	}

	static toStringNullSafe(value) {
		return value === null || value === undefined ? "" : String(value)
	}

	static toNumberNullSafe(value) {
		return value === null || value === undefined ? 0 : Number(value)
	}

	static createFiltersFromQueryParams(queryParams) {
		const filters = {}
		const filtersNames = queryParams === null ? [] : Object.keys(queryParams)

		for (const filterName of filtersNames) {
			if (filterName === "ForSelect") {
				continue
			}

			switch (filterName) {
				case "Name":
					filters.Name = { $regex: queryParams[filterName], $options: "i" }
					break
				case "category":
					filters.category = queryParams[filterName]
					break
				case "priceMin":
				case "priceMax":
					if (!filters.price) {
						filters.price = {}
					}
					if (filterName === "priceMin") {
						filters.price.$gte = queryParams[filterName]
					} else if (filterName === "priceMax") {
						filters.price.$lte = queryParams[filterName]
					}
					break
				case "available":
					filters.available = queryParams[filterName] === "true"
					break
				// Agrega más casos según los filtros que necesites manejar
				default:
					// Si hay otros filtros específicos, agrégalos aquí
					filters[filterName] = queryParams[filterName]
					break
			}
		}

		return filters
	}
}

export default Helpers
