const verifyRole =
	(...allowedRoles) =>
	(req, res, next) => {
		if (!allowedRoles.includes(req.user.role)) {
			return res.status(403).json({
				message: "You do not have permission to do this action!",
			});
		}

		next();
	};

module.exports = verifyRole;
