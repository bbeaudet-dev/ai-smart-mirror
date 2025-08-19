const Translator = (function () {
	return {
		/**
		 * Translate a key to a string.
		 * @param {Module} module The module to translate the key for.
		 * @param {string} key The key of the text to translate.
		 * @param {object} variables The variables to use within the translation template (optional)
		 * @returns {string} the translated key
		 */
		translate (module, key, variables = {}) {
			/**
			 * Combines template and variables like:
			 * template: "Please wait for {timeToWait} before continuing with {work}."
			 * variables: {timeToWait: "2 hours", work: "painting"}
			 * to: "Please wait for 2 hours before continuing with painting."
			 * @param {string} template Text with placeholder
			 * @param {object} variables Variables for the placeholder
			 * @returns {string} the template filled with the variables
			 */
			function createStringFromTemplate (template, variables) {
				if (Object.prototype.toString.call(template) !== "[object String]") {
					return template;
				}
				let templateToUse = template;
				if (variables.fallback && !template.match(new RegExp("{.+}"))) {
					templateToUse = variables.fallback;
				}
				return templateToUse.replace(new RegExp("{([^}]+)}", "g"), function (_unused, varName) {
					return varName in variables ? variables[varName] : `{${varName}}`;
				});
			}

			// Since we only have English, just return the key with variable substitution
			return createStringFromTemplate(key, variables);
		},

		/**
		 * Load a translation file (json) and remember the data.
		 * @param {Module} module The module to load the translation file for.
		 */
		async load (module) {
			// No-op since we don't use translation files
			Log.log(`${module.name} - Translation loading disabled (English only)`);
		},

		/**
		 * Load the core translations.
		 */
		async loadCoreTranslations () {
			// No-op since we don't use translation files
			Log.log("Core translations disabled (English only)");
		},

		/**
		 * Load the core translations' fallback.
		 * The first language defined in translations.js will be used.
		 */
		async loadCoreTranslationsFallback () {
			// No-op since we don't use translation files
			Log.log("Core translation fallback disabled (English only)");
		}
	};
}());

window.Translator = Translator;
