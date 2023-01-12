const filterObject = (inputObj, ...allowedFields) => {
	const updateFieldsObj = {};

	allowedFields.forEach((field) => {
		if (inputObj[field] !== undefined) {
			updateFieldsObj[field] = inputObj[field];
		}
	});

	return updateFieldsObj;
};

module.exports = filterObject;
