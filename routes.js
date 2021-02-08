var bodyParser = require('body-parser');
var crypto = require('crypto');
var cors = require('cors')
var request = require('request');
var db = require('./services/dataservice.js');

db.connect();

var routes = function () {
    var router = require('express').Router();

    router.use(bodyParser.urlencoded({
        extended: true
    }));

    router.use(function (req, res, next) {
        //only check for token if it is PUT, DELETE methods or it is POSTING to events
        if (req.method == "PUT" || req.method == "DELETE"
            || (req.method == "GET" && req.url.includes("/getbusarrival"))
            || (req.method == "GET" && req.url.includes("/getserviceinfo"))
            || (req.method == "GET" && req.url.includes("/searchstopname"))
            || (req.method == "POST" && req.url.includes("/getfavouriteservices"))
            || (req.method == "POST" && req.url.includes("/getfavouritestops"))
            || (req.method == "POST" && req.url.includes("/savefavouritebus"))
            || (req.method == "POST" && req.url.includes("/savefavouritebusstop"))) {
            var token = req.query.token;
            if (token == undefined) {
                res.status(401).send("Please check if you are logged in before using this feature.");
            } else {
                db.checkToken(token, function (err, organizer) {
                    if (err || organizer == null) {
                        res.status(401).send("Unable to perform this action. Please check with the system administrator");
                    } else {
                        //means proceed on with the request.
                        next();
                    }
                });
            }
        } else {    //all other routes will pass
            next();
        }
    });

    router.get('/', function (req, res) {
        res.sendFile(__dirname + "/views/index.html");
    });

    router.get('/register', function (req, res) {
        res.sendFile(__dirname + "/views/register.html");
    });
    router.get('/login', function (req, res) {
        res.sendFile(__dirname + "/views/login.html");
    });
    router.get('/saveservice', function (req, res) {
        res.sendFile(__dirname + "/views/saveFavService.html");
    });
    router.get('/savestop', function (req, res) {
        res.sendFile(__dirname + "/views/saveFavStop.html");
    });
    router.get('/favorites', function (req, res) {
        res.sendFile(__dirname + "/views/favorites.html");
    });
    router.get('/homepage', function (req, res) {
        res.sendFile(__dirname + "/views/homepage.html");
    });
    router.get('/findbusstop', function (req, res) {
        res.sendFile(__dirname + "/views/findbusstop.html");
    });
    router.get('/findbusinfo', function (req, res) {
        res.sendFile(__dirname + "/views/busserviceinfo.html");
    });

    router.get('/profile', function (req, res) {
        res.sendFile(__dirname + "/views/viewprofile.html");
    });
    router.get('/editprofile', function (req, res) {
        res.sendFile(__dirname + "/views/editprofile.html");
    });
    router.get('/css/*', function (req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    router.get('/js/*', function (req, res) {
        res.sendFile(__dirname + "/views/" + req.originalUrl);
    });

    router.post('/register', function (req, res) {
        var data = req.body;
        db.addUser(data.username, data.password, function (err, user) {
            if (err) {
                res.status(500).send("Unable to register a new user");
            } else {
                res.status(200).send("User has been successfully registered!");
            }
        })
    })

    router.post('/login', function (req, res) {
        var data = req.body;
        db.login(data.username, data.password, function (err, user) {
            if (err) {
                res.status(401).send("Login unsucessful. Please try again later");
            } else {
                if (user == null) {
                    res.status(401).send("Login unsucessful. Please try again later");
                } else {
                    var strToHash = user.username + Date.now();
                    var token = crypto.createHash('md5').update(strToHash).digest('hex');
                    db.updateToken(user._id, token, function (err, user) {
                        res.status(200).json({ 'message': 'Login successful.', 'token': token ,'Id': user._id });
                    });
                }
            }
        })
    })


    router.get("/logout", function (req, res) {
        var token = req.query.token;
        if (token == undefined) {
            res.status(401).send("No tokens are provided");
        } else {
            db.checkToken(token, function (err, user) {
                if (err || user == null) {
                    res.status(401).send("Invalid token provided");
                } else {
                    db.removeToken(user._id, function (err, user) {
                        res.status(200).send("Logout successfully")
                    });
                }
            })
        }
    })

        //get user by id
        router.get('/user/:id', function (req, res) {
            var id = req.params.id;
            console.log(id);
            db.getUser(id, function (err, user) {
                if (err) {
                    res.status(500).send("Unable to find user with this id");
                } else {
                    res.status(200).send(user);
                    console.log(user);
                }
            })
        })
        
        //update pass
        router.put('/user', function (req, res) {
            console.log("update password");
            var data = req.body;
            db.updateUserpass(data.id, data.password,
                function (err, user) {
                    res.end();
                });
        })

    router.get('/getbusarrival/:BusStopCode', function (req, res) {
        var BusStopCode = req.params.BusStopCode;
        console.log(BusStopCode);
        db.getBusArrival(BusStopCode, function (err, arrival) {
            if (err) {
                res.status(401).send("unable to get arrival timing with the provided bus stop code");
            } else {
                res.status(200).send(arrival);
            }
        });
    });

    //Set the bus services of choice as favourite
    router.post('/savefavouritebus', function (req, res) {
        var data = req.body;
        db.addFavService(data.username, data.services, function (err) {
            if (err) {
                res.status(401).send("unable to add favourite bus");
            } else {
                res.status(200).send("Added Successfully!");
            }
        });
    });

    //Set the bus stop of choice as favourite
    router.post('/savefavouritebusstop', function (req, res) {
        var data = req.body;
        db.addFavStop(data.username, data.BusStopCode, function (err) {
            if (err) {
                res.status(401).send("unable to add favourite bus stop");
            } else {
                res.status(200).send("Added Successfully!");
            }
        });
    });

    //Search bus route via bus number
    router.post('/api/searchbusroute', function (req, res) {

    })
    //Search for Bus Services by bus stop name e.g Orchard MRT Station
    router.get('/searchstopname', function (req, res) {
        db.getBusStops(function (err, busstop) {
            if (err) {
                res.status(401).send("Unable to get bus stops information");
            } else {
                res.status(200).send(busstop);
            }
        });
    });

    router.post('/getfavouriteservices', function (req, res) {
        var data = req.body;
        db.getFavService(data.username, function (err, arrival) {
            if (err) {
                res.status(401).send("unable to get favourite bus services");
            } else {
                res.status(200).send(arrival);
            }
        });
    });

    router.post('/getfavouritestops', function (req, res) {
        var data = req.body;
        db.getFavStops(data.username, function (err, arrival) {
            if (err) {
                res.status(401).send("unable to get favourite bus stops");
            } else {
                res.status(200).send(arrival);
            }
        });
    });

    router.delete('/favouriteservice/:id', function (req, res) {
        var id = req.params.id;
        db.deleteFavService(id, function (err, event) {
            if (err) {
                res.status(500).send("Unable to delete the service");
            } else {
                if (event == null) {
                    res.status(200).send("No service is deleted");
                } else {
                    res.status(200).send("service has been deleted successfully");
                }
            }
        });
    });

    //View Bus Service information like First bus,Last bus and what operator operates that bus service
    router.get('/getserviceinfo', function (req, res) {
        db.getBusInfo(function (err, busstop) {
            if (err) {
                res.status(401).send("Unable to get bus service information");
            } else {
                res.status(200).send(busstop);
            }
        });
    })

    return router;
};

module.exports = routes();
