/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,jsx}", "./public/**/*.html", "./index.html"],
	theme: {
		extend: {
			"-50%": "-50%",
			fontFamily: {
				montserrat: ["Montserrat", "sans-serif"],
			},
		},
	},
	plugins: [],
	darkMode: ["selector"],
}
