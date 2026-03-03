// see -> https://qiita.com/Shilaca/items/c494e4dc6b536a5231de
import js from "@eslint/js";
import globals from "globals";

export default [
	js.configs.recommended, // eslint:recommended
	{
		languageOptions: {
			parserOptions: {
				ecmaVersion: "latest"
			},
			globals: {
				...globals.es2026,
				...globals.browser,
				...globals.worker,
				...globals.node,
				Notifier: "writable"
			}
		}
	}
];