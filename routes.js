var bodyParser = require('body-parser');
var crypto = require('crypto');
var request = require('request');
var db = require('./services/dataservice.js');

db.connect();

var routes = function () {
    var router = require('express').Router();

    router.use(bodyParser.urlencoded({
        extended: true
    }));


    // var options = {
    //   'method': 'GET',
    //   'url': 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=44009',
    //   'headers': {
    //     'AccountKey': 'b+8pVHKwRkyLKABbXVxmpQ=='
    //   }
    // };
    // request(options, function (error, response) {
    //   if (error) throw new Error(error);
    //   console.log(response.body);
    // });

    router.use(function(req,res,next){
        //only check for token if it is PUT, DELETE methods or it is POSTING to events
        if(req.method=="PUT" || req.method=="DELETE"
            || (req.method=="POST" && req.url.includes("/events"))) {
            var token = req.query.token;
            if (token == undefined) {
                res.status(401).send("No tokens are provided. You are not allowed to perform this action.");
            } else {
                db.checkToken(token, function (err, organizer) {
                    if (err || organizer == null) {
                        res.status(401).send("[Invalid token] You are not allowed to perform this action.");
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
    // router.get('/edit', function (req, res) {
    //     res.sendFile(__dirname + "/views/editEvent.html");
    // });
    router.get('/register', function (req, res) {
        res.sendFile(__dirname + "/views/register.html");
    });
    router.get('/login', function (req, res) {
        res.sendFile(__dirname + "/views/login.html");
    });
    router.get('/favorites', function (req, res) {
        res.sendFile(__dirname + "/views/favorites.html");
    });
    router.get('/results', function (req, res) {
        res.sendFile(__dirname + "/views/results.html");
    });
    router.get('/css/*', function(req, res)  {
        res.sendFile(__dirname+"/views/"+req.originalUrl);
    });
    
    router.get('/js/*', function(req, res)  {
        res.sendFile(__dirname+"/views/"+req.originalUrl);
    });

    // router.get('/events', function (req, res) {
    //     db.getAllEvents(function (err, events) {
    //         if (err) {
    //             res.status(500).send("Unable to get all events.");
    //         } else {
    //             res.status(200).send(events);
    //         }
    //     })
    // })
    // router.get('/events/:id', function (req, res) {
    //     var id = req.params.id;
    //     db.getEvent(id, function (err, event) {
    //         if (err) {
    //             res.status(500).send("Unable to find an event with this id");
    //         } else {
    //             res.status(200).send(event);
    //         }
    //     })
    // })
    // router.post('/events', function (req, res) {
    //     var data = req.body;
    //     db.addEvent(data.name, data.description, data.startDate, data.startTime, data.endDate, data.endTime,
    //         function (err, event) {
    //             if (err) {
    //                 res.status(500).send("Unable to add a new event");
    //             } else {
    //                 res.status(200).send("Event has been successfully added!");
    //             }
    //         })
    // });

    // router.put('/events', function (req, res) {
    //     var data = req.body;
    //     db.updateEvent(data.id, data.name, data.description, data.startDate, data.startTime, data.endDate, data.endTime,
    //         function (err, event) {
    //             if (err) {
    //                 res.status(500).send("Unable to update the event");
    //             } else {
    //                 if (event == null) {
    //                     res.status(200).send("No event is updated");
    //                 } else {
    //                     res.status(200).send("Event has been updated successfully");
    //                 }
    //             }
    //         });
    // })

    // router.delete('/events/:id', function (req, res) {
    //     var id = req.params.id;
    //     db.deleteEvent(id, function (err, event) {
    //         if (err) {
    //             res.status(500).send("Unable to delete the event");
    //         } else {
    //             if (event == null) {
    //                 res.status(200).send("No event is deleted");
    //             } else {
    //                 res.status(200).send("Event has been deleted successfully");
    //             }
    //         }
    //     });
    // })

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
                        res.status(200).json({ 'message': 'Login successful.', 'token': token });
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

    //Set the bus services of choice as favourite
    router.put('/api/savefavouritebus', function(req,res){
        
    })

    //Set the bus stop of choice as favourite
    router.put('/api/savefavouritebustop', function(req,res){

    })

    //Search bus route via bus number
    router.post('/api/searchbusroute', function (req, res) {
        
    })
    //Search for Bus Services by bus stop name e.g Orchard MRT Station
    router.post('/api/searchstopname', function (req, res) {
        
    })
    //Search for Bus stops via bus stop number
    router.post('/api/searchstopnumber', function (req, res) {
        
    })

    //View Bus Service information like First bus,Last bus and what operator operates that bus service
    router.get('/api/getserviceinfo', function (req, res) {
        
    })

    //Search for Bus Route via service number e.g 190.
    router.post('/getserviceroute', function (req, res) {
        var data = req.body;
        db.getData(data.BusNumber, function(err,service){
            if (err) {
                //console.log(service);
                console.log(data.service);
                res.status(500).send("Unable to get bus number information");
            } else {
                res.status(200).send(service);
            }
        })
    })


    // router.get('/api/getbusarrival', function (req, res) {
    //     var data = req.body;
    //     db.getData(data.busStop, function(err,service){
    //         if (err) {
    //             //console.log(service);
    //             console.log(data.service);
    //             res.status(500).send("Unable to get bus information");
    //         } else {
    //             res.status(200).send(service);
    //         }
    //     })
    // })

    router.post('/getbusarrival', function (req, res) {
        var data = req.body;
        db.getData(data.BusStopCode, function(err,service){
            if (err) {
                //console.log(service);
                console.log(data.service);
                res.status(500).send("Unable to get bus arrival information");
            } else {
                res.status(200).send(service);
            }
        })
    })


    return router;
};

module.exports = routes();
