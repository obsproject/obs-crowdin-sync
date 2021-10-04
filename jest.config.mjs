export default {
	testEnvironment: 'node',
	preset: 'ts-jest',
	transform: {
		'\\.js?$': 'babel-jest'
	},
	transformIgnorePatterns: ['node_modules/(?!p-limit|yocto-queue).+\\.js']
};
