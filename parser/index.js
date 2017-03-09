'use strict';

//const colors = require('colors');
const dictionary = require('./dictionary');
const moment = require('moment');

let getFeel = temp => {
	if (temp < -3) {
		return "Freezing cold & possible snow";
	} else if (temp >= -3 && temp <5) {
		return "Shivering cold";
	} else if (temp >=5 && temp < 15) {
		return "pretty cold";
	} else if (temp >=15 && temp < 25) {
		return "warm";
	} else if (temp >=25 && temp < 35) {
		return "hot";
	} else if (temp >=35 && temp < 45) {
		return "very hot";
	} else {
		return "super hot";
	}
}

let getPrefix = (conditionCode, tense = 'present') => {
	let findPrefix = dictionary[tense].find(item => {
		if(item.codes.indexOf(Number(conditionCode)) > -1) {
			return true;
		}
	});

	return findPrefix.prefix || "";
}

let currentWeather = response => {
	if (response.query.results) {
		let resp = response.query.results.channel;
		let location = `${resp.location.city}, ${resp.location.country}`;

		let {text, temp, code} = resp.item.condition; // text = resp.item.condition.text; temp = resp.item.condition.temp;

		return `Right now, ${getPrefix(code)} ${text.toLowerCase()} in ${location}. It is ${getFeel(Number(temp))} at ${temp} degrees Celsius.`
	} else {
		return "I don't seem to know anything about this place...Sorry :(";
	}
}

let getDate = day => {
	let dayStr = day.toLowerCase().trim();
	switch(dayStr) {
		case 'tomorrow':
			return moment().add(1, 'd').format("DD MMM YYYY");
		case 'day after tomorrow':
			return moment().add(2, 'd').format("DD MMM YYYY");
		default:
			return moment().format("DD MMM YYYY");
	}
}


let forecastWeather = (response, data) => {
	if(response.query.results) {
		// convert 'tomorrow', 'day after tomorrow', 'today' into date formats like 23 June 2016
		let parseDate = getDate(data.time);
		let resp = response.query.results.channel;
		let getForecast = resp.item.forecast.filter(item => {
			return item.date === parseDate;
		})[0];
		let location = `${resp.location.city}, ${resp.location.country}`;
		let regEx = new RegExp(data.weather, "i");
		let testConditions = regEx.test(getForecast.text); // true or false
		return `${testConditions ? 'Yes' : 'No'}, ${getPrefix(getForecast.code, 'future')} ${getForecast.text} ${data.time} in ${location}`;
	} else {
		return "I don't seem to know anything about this place...Sorry :(";
	}
}

module.exports = {
	currentWeather,
	forecastWeather
}