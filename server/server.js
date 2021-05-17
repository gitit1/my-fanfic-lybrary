const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const passport = require("passport");


const publicDir = require('path').join(__dirname, '/public');
const buildDir = require('path').join(__dirname, '/build');
require('./config/mongoose.js')
require('./controllers/connection/socket/socket');

const app = express();
const keys = require("./config/keys");

app.use(express.static(publicDir));
app.use(express.static(buildDir));
app.use(express.static(__dirname));

app.use(passport.initialize());
require("./config/passport")(passport);

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

if (keys.nodeEnv === 'development') {
	//development!!! (Ver 1)
	app.listen(5000, () => console.log(`Listening on port 5000 - development mode`));
}
else if (keys.nodeEnv === 'straight') {
	//Straight!!! (Ver 3)
	app.get('/*', function (req, res) {
		res.sendFile(require('path').join(buildDir, '/index.html'));
	});
	app.listen(5008, () => console.log(`Listening on port 5008 - production mode`));
}
else {
	//Gay!!! (Ver 2)
	app.get('/*', function (req, res) {
		require('./cronJobs/cron');
		res.sendFile(require('path').join(buildDir, '/index.html'));
	});
	app.listen(5000, () => console.log(`Listening on port 5000 - production mode`));
}
