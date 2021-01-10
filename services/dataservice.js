var mongoose = require('mongoose');
var request = require('request');
var schema = mongoose.Schema;
var eventSchema = {};
var organizerSchema = {};
var eventModel, organizerModel;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


var database = {
    connect: function () {
        mongoose.connect('mongodb://localhost:27017/project', function (err) {
            if (err == null) {
                console.log("Connected to Mongo DB");
                //initialize values
                eventSchema = schema({
                    name: String,
                    description: String,
                    start: {
                        date: String,
                        time: String
                    },
                    end: {
                        date: String,
                        time: String
                    }
                });

                organizerSchema = schema({
                    name: String,
                    username: String,
                    password: String,
                    company: String,
                    token: String
                });

                servicesSchema = schema({
                    BusStopCode: String,
                    Services: [
                        {
                            ServiceNo: String,
                            Operator: String,
                            NextBus: {
                                OriginCode: String,
                                DestinationCode: String,
                                EstimatedArrival: String,
                                Latitude: String,
                                Longitude: String,
                                VisitNumber: String,
                                Load: String,
                                Feature: String,
                                Type: String
                            },
                            NextBus2: {
                                OriginCode: String,
                                DestinationCode: String,
                                EstimatedArrival: String,
                                Latitude: String,
                                Longitude: String,
                                VisitNumber: String,
                                Load: String,
                                Feature: String,
                                Type: String
                            },
                            NextBus3: {
                                OriginCode: String,
                                DestinationCode: String,
                                EstimatedArrival: String,
                                Latitude: String,
                                Longitude: String,
                                VisitNumber: String,
                                Load: String,
                                Feature: String,
                                Type: String
                            },
                        }
                    ],
                })

                userSchema = schema({
                    username: String,
                    password: String,
                    token: String
                });

                favserviceSchema = schema({
                    username: String,
                    services: String
                });

                favstopSchema = schema({
                    username: String,
                    stops: String
                });

                var connection = mongoose.connection;
                eventModel = connection.model('events', eventSchema);
                organizerModel = connection.model('organizers', organizerSchema);
                serviceModel = connection.model('services', servicesSchema);
                userModel = connection.model('users', userSchema);
                favserviceModel = connection.model('favservices', favserviceSchema);
                favstopModel = connection.model('favstops', favstopSchema);
            } else {
                console.log("Error connecting to Mongo DB");
            }
        })
    },

    getAllEvents: function (callback) {
        eventModel.find({}, callback);
    },
    addEvent: function (n, d, sd, st, ed, et, callback) {
        var newEvent = new eventModel({
            name: n,
            description: d,
            start: {
                date: sd,
                time: st
            },
            end: {
                date: ed,
                time: et
            }
        });
        newEvent.save(callback);
    },
    getEvent: function (id, callback) {
        eventModel.findById(id, callback);
    },
    updateEvent: function (id, n, d, sd, st, ed, et, callback) {
        var updatedEvent = {
            name: n,
            description: d,
            start: {
                date: sd,
                time: st
            },
            end: {
                date: ed,
                time: et
            }
        };
        eventModel.findByIdAndUpdate(id, updatedEvent, callback);
    },
    deleteEvent: function (id, callback) {
        eventModel.findByIdAndDelete(id, callback);
    },
    addUser: function (un, p, callback) {
        var newUser = new userModel({
            username: un,
            password: p
        });
        newUser.save(callback);
    },
    login: function (u, p, callback) {
        userModel.findOne({ username: u, password: p }, callback);
    },
    updateToken: function (id, token, callback) {
        userModel.findByIdAndUpdate(id, { token: token }, callback);
    },
    checkToken: function (token, callback) {
        userModel.findOne({ token: token }, callback);
    },
    removeToken: function (id, callback) {
        userModel.findByIdAndUpdate(id, { $unset: { token: 1 } }, callback);
    },

    getData(busStop, callback) {

        var options = {
            'method': 'GET',
            'url': `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStop}`,
            'headers': {
                'AccountKey': 'b+8pVHKwRkyLKABbXVxmpQ=='
            }
        };
        request(options, function (error, response) {
            if (error) { throw new Error(error) }
            else {
                //console.log(response.body);
                return callback(null, JSON.parse(response.body))
            }
        });
    },

    getTimingForStop(busStop, callback) {
        this.getData(busStop, payload => {
            payload = payload.Services;
            callback({
                services: payload.map(service => service.ServiceNo),
                timings: payload.reduce((timings, service) => {
                    function timingObj(service, type) {
                        var arrival = new Date(service[type].EstimatedArrival);
                        return {
                            arrival: arrival,
                            secondsToArrival: Math.floor(Math.max(0, (arrival - +new Date()) / 1000)),
                            load: service[type].Load,
                            isWAB: service[type].Feature === 'WAB'
                        };

                    }
                    var types = ['NextBus', 'NextBus2', 'NextBus3'];
                    timings[service.ServiceNo] = {
                        availableBuses: service.NextBus.EstimatedArrival === '' ? 0 : service.NextBus2.EstimatedArrival === '' ? 1 : service.NextBus3.EstimatedArrival === '' ? 2 : 3,
                        buses: []
                    };
                    for (var i = 0; i < timings[service.ServiceNo].availableBuses; i++) {
                        timings[service.ServiceNo].buses.push(timingObj(service, types[i]))
                    }
                    return timings;
                }, {})
            });
        });
    },

    // getData(busStop, callback) {
    // 	//if (this.options.request) this.options.request(busStop, callback);
    // 	//else
    // 		request({
    // 			url: `http://datamall2.mytransport.sg/ltaodataservice/BusArrival?${busStop}&SST=True`,
    // 			headers: {
    // 				'AccountKey': 'b+8pVHKwRkyLKABbXVxmpQ=='
    // 			}
    // 		}, (err, res) => {
    // 				callback(JSON.parse(res.body));
    // 		});
    // }



    // apiKey = "b+8pVHKwRkyLKABbXVxmpQ==";
    // if (!apiKey || typeof apiKey !== 'string') throw new TypeError('API Key must be a string!');
    //this.apiKey = apiKey;
    //this.options = Object.assign({
    //	requester: null
    // }, options || {});


    // var options = {
    //     'method': 'GET',
    //     'url': `http://datamall2.mytransport.sg/ltaodataservice/BusArrival?BusStopID=${busStop}&SST=True`,
    //      'headers': {
    //        'AccountKey': 'b+8pVHKwRkyLKABbXVxmpQ=='
    //     }
    //   };
    //   request(options, function (error, response) {
    //     if (error) throw new Error(error);
    //     //console.log(response.body);
    //     else
    //     callback(JSON.parse(response.body));
    //   });


    //if (this.options.requester) this.options.requester(busStop, callback);
    //else
    //         request({
    //             			url: `http://datamall2.mytransport.sg/ltaodataservice/BusArrival?${busStop}&SST=True`,
    //             			headers: {
    //             				'AccountKey': 'b+8pVHKwRkyLKABbXVxmpQ=='
    //             			}
    //             		}, (err, res) => {
    //             				callback(JSON.parse(res.body));
    //             		});
    // }
};

module.exports = database;