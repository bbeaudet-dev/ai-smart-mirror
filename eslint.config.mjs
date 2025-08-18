import {defineConfig, globalIgnores} from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
	// Ignore MM core bits we don't want to touch
	globalIgnores(["config/**", "modules/default/**", "js/positions.js"]),

	// Base config for the repo
	{
		files: ["**/*.js"],
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				...globals.browser,
				...globals.node,
				Log: "readonly",
				MM: "readonly",
				Module: "readonly",
				config: "readonly",
				moment: "readonly"
			}
		},
		plugins: { js },
		rules: {
			...js.configs.recommended.rules,
			// Relax noisy globals for MM core files
			"no-console": "off",
			"no-prototype-builtins": "off",
			"no-global-assign": "off",
			"no-unused-vars": "warn"
		}
	},

	// Stricter rules for OUR code only
	{
		files: ["server/**/*.js", "modules/ai-*/**/*.js"],
		rules: {
			"no-console": "warn",
			"prefer-const": "error",
			"no-var": "error",
			"eqeqeq": "error",
			"curly": "error",
			"dot-notation": "error",
			"no-shadow": "warn",
			"consistent-return": "warn",
			"no-redeclare": "off" // Allow global variable comments
		}
	}
]);
