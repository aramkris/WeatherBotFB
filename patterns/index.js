const patternDict = [ {
	pattern: '\\b(?<greeting>Hi|Hello|Hey|Howdy)\\b',
	intent: 'Hello'
}, {
	pattern: '\\b(?<thanks>bye|Goodbye|exit|quit|C U)\\b',
	intent: 'Exit'
}, {
	pattern: 'like\\sin\\s\\b(?<city>.+)',
	intent: 'CurrentWeather'
}, {
	pattern: 'weather\\sin\\s\\b(?<city>.+)',
	intent: 'CurrentWeather'
}, {
	pattern: '\\b(?<weather>hot|cold|rain|rainy|sunny|snow|thunderstorms|windy|drizzle)\\b\\sin\\s\\b(?<city>[a-z]+[ a-z]+?)\\b(?<time>day\\safter\\stomorrow|tomorrow|today)$',
	intent: 'WeatherForecast'
}, {
	pattern: '\\b(?<weather>hot|cold|rain|rainy|sunny|snow|thunderstorms|windy|drizzle)\\b\\s\\b(?<time>day\\safter\\stomorrow|tomorrow|today)\\sin\\s\\b(?<city>[a-z]+[ a-z]+?)$',
	intent: 'WeatherForecast'
}];

module.exports = patternDict;