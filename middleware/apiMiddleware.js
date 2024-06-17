export function ErrorHandler(err, req, res, next) {
	// console.error({
	//   method: req.method,
	//   url: req.url,
	//   body: req.body,
	//   params: req.params,
	//   query: req.query,
	//   message: err.message,
	//   err
	// })
	// console.log(111, err)
	const errorMessage = err.status === 404 ? "Ruta no encontrada...." : err.message
	const response = {
		success: false,
		message: errorMessage,
		data: null,
	}
	console.log(err)
	res.status(err.status || 500).json(response)
}

export function ResourceNotFound(req, res, next) {
	console.log(req)
	const error = new Error("Ruta no encontrada...")
	error.status = 404
	next(error)
}
