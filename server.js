'use strict';

const Restify = require('restify');
//const bodyParser = require('body-parser');
const server = Restify.createServer({
	name: 'WeatherMessenger'
});
const PORT = process.env.PORT || 3000;

server.use(Restify.queryParser());
server.use(Restify.jsonp());
server.use(Restify.bodyParser());

// Tokens
const config = require('./config');

// FBeamer
const FBeamer = require('./fbeamer');
const f = new FBeamer(config);

const matcher = require('./matcher');
const weather = require('./weatherapi');

const {currentWeather, forecastWeather} = require('./parser');

//Registering Webhooks
server.get('/', (req,res,next) => {
	//res.send("hello");
	f.registerHook(req,res);
	return next();
});


//Receiving POST requests
server.post('/', (req,res,next) => {
	f.incoming(req,res,msg => {
		f.txt(msg.sender, `Hey, you just said ${msg.message.text}`);
		/*f.img(msg.sender, "http://proxioty.com/ibfw.jpg"); */

		if (msg.message.text) {
			matcher(msg.message.text, data => {
				switch(data.intent) {
					case 'Hello':
						f.txt(msg.sender, `${data.entities.greeting} to you too`);
						break;
					case 'CurrentWeather':
						weather(data.entities.city, 'current')
						.then(response => {
							let parseResult = currentWeather(response);
							f.txt(msg.sender, parseResult);
						})
						.catch(error => {
							console.log("Something is amiss with the weather service");
							f.txt(msg.sender, "Hmmm.... I am unable to get the weather at this time. Please check back after sometime. Sorry");
						});
						break;
					case 'WeatherForecast':
						weather(data.entities.city)
						.then(response => {
							let parseResult = forecastWeather(response, data.entities);
							f.txt(msg.sender, parseResult);
						})
						.catch(error => {
							console.log("Something is amiss with the weather service");
							f.txt(msg.sender, "Hmmm.... I am unable to get the weather at this time. Please check back after sometime. Sorry");
						});
						break;
					default:
						f.txt(msg.sender,  "This is embarrassing :(. I am not able to understand what you said");

				}
			});
		}
	});
	return next();
});

f.subscribe();

server.listen(PORT, () => console.log(`WeatherBot running on port ${PORT}`));