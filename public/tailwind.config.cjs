const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	],

	theme: {
		colors: {
			'bigstone': '#1F2937',
			'azul': '#19BBC0',
			'azul_claro': '#75D3D5',
		  },
		extend: {}
	},

	plugins: [
		require('flowbite/plugin')
	],
};

module.exports = config;
