const originalFetch = fetch
window.fetch = async (...args) => {
	console.log("fetch-interceptor", args)
	const response = await originalFetch(...args)
	if (response.status === 401) {
		const data = await response.json()
		window.location.href = data.url
	}
	return response
}
