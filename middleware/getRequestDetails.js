module.exports = (req, res, next) => {
	console.log({ host: req.headers.host, url: req.url, method: req.method });
	// console.log({
	// 	method: req.method,
	// 	protocol: req.protocol,
	// 	host: req.hostname,
	// 	url: req.url,
	// 	headers: req.headers,
	// });

	next();
};
