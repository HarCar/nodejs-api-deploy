import globals from "globals"
import pluginJs from "@eslint/js"
import eslintconfigprettier from "eslint-config-prettier"

export default [
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
	},
	pluginJs.configs.recommended,
	eslintconfigprettier,
	{
		rules: {
			semi: ["error", "never"],
			"prefer-const": "error",
			"no-unused-vars": "error",
			"no-multiple-empty-lines": ["error", { max: 1 }],
			"spaced-comment": ["error", "always"],
		},
	},
]
