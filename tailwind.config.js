/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		fontFamily: {
			sans: ['PPSupplySans-Regular'],
		},
		extend: {
			lineHeight: {
				title: '90%',
			},
		},
	},
	plugins: [],
};
