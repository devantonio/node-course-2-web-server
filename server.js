//IN PACKAGE.JSON for heroku to run server.js//heroku will look for the start script 
//and the start script will be responsable for running server.js 

//WHEN RUNNING PARTIALS IN SERVER 
//nodemon server.js -e js,hbs
//we're gonna watch(-e) the js extension and the hbs extension
//middleware is executed in the order you call app.use
//to communicate with my machine and github i hae to use sshkey
//sshkey is use to communicate between two computers

const express = require('express');
const handlebars = require('hbs');
const fs = require('fs');

//heroku is going to set port. the port will change over time//when we run the app locally the 
//port env variable is not going to exist// if thats the case then use port 3000
//now we have an app that is configured with heroku and will still work locally
const port = process.env.PORT || 3000;
var app = express();

//let handlebars know we want to set up support for partials
handlebars.registerPartials(__dirname + '/views/partials');//__dirname is the absolute directory 

app.set('view engine', 'hbs');//this is going to tell express what view engine we'd like to use 





//app.use is how you register middleware
//next exists so you can tell express when your middleware function is done
//so it can go execute the next function
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;//takes the request object //see express site
	console.log(log);
	//fs.appendFile takes two args//the filename and the thing you want to add/append
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err === undefined) {
			console.log('Unable to append to server.log');
		}
	});
	next();//if something goes wrong you can avoid calling next to the next middleware
});





//this middleware is going to stop everything after it from executing 
//if we call next, it will execute the next middleware
//if this code was at the bottom it will not run until the rest of the middleware run
//middleware is executed in the order you call app.use
// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');
// });

//middleware lets you configure how your express application works
//this renders the help.html page
app.use(express.static(__dirname + '/public'));


handlebars.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear()
});

handlebars.registerHelper('yellIt', (text) => {
	return text.toUpperCase();
});


app.get('/', (req, res) => {// forward slash is refered to s the root route
	//res.send('<h1>Hello Express</h1>');
	// res.send({
	// 	name: 'Antonio',
	// 	likes: [
	// 		'Biking',
	// 		'Cities'
	// 		]
	// });
	res.render('home.hbs', {
		pageTitle: 'Home',
		welcomeMessage: 'Welcome to my home page!'
	});
});

app.get('/about', (req, res) => {
	//res.send('About Page');
	res.render('about.hbs', {
		pageTitle: 'About Page'
	});//render is going to let you set up any templates you have set up with your current view engine
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to handle request'
	});
});

app.listen(port, () => {// app.listen takes a optional 2nd argument that lets us do something once the server is up
	console.log(`server is up on port ${port}`); 
});