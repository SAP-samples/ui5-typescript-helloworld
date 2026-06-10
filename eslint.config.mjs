import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	tseslint.configs.eslintRecommended,
	...tseslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				sap: "readonly"
			},
			ecmaVersion: 2023,
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		ignores: ["eslint.config.mjs"]
	}
);
