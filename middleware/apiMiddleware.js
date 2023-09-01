export function ErrorHandler (err, req, res, next) {
  console.error({
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    err
  })

  const errorMessage = err.status === 404 ? 'Ruta no encontrada' : 'Algo salió mal'
  res.status(err.status || 500).json({
    success: false,
    message: errorMessage,
    data: null
  })
}

export function ResourceNotFound (req, res, next) {
  const error = new Error('Ruta no encontrada')
  error.status = 404
  next(error)
}
