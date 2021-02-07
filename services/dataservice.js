var mongoose = require('mongoose');
var request = require('request');
var schema = mongoose.Schema;
var eventSchema = {};
var organizerSchema = {};
var servicesSchema = {};
var userSchema = {};
var favserviceSchema = {};
var favstopSchema = {};
var busstopSchema = {};
var eventModel, organizerModel, serviceModel, userModel, favserviceModel, favstopModel, busstopModel;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('debug', true);

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
                });

                busstopSchema = schema({
                    value: [
                        {
                            BusStopCode: String,
                            RoadName: String,
                            Description: String,
                            Latitude: String,
                            Longitude: String
                        }
                    ]
                });

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
                busstopModel = connection.model('busstop', busstopSchema);
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
    // getBusArrival: function (busstopcode, callback) {
    //     // serviceModel.findById(id, callback);
    //     serviceModel.findOne({ BusStopCode: busstopcode }, callback);
    // },

    getBusArrival: function (busstopcode, callback) {
        var options = {
            'method': 'GET',
            'url': `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busstopcode}`,
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

    getBusStops: function (callback) {
        var options = {
            'method': 'GET',
            'url': `http://datamall2.mytransport.sg/ltaodataservice/BusStops`,
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



    getAllBusArrivals: function (callback) {
        serviceModel.find({}, callback);
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



    addFavService: function (un, service, callback) {
        var newFavService = new favserviceModel({
            username: un,
            services: service
        });
        newFavService.save(callback);
    },

    addFavStop: function (un, stop, callback) {
        var newFavStop = new favstopModel({
            username: un,
            stops: stop
        });
        newFavStop.save(callback);
    },

    getFavService: function (callback) {
        favserviceModel.find({}, callback);
    },


    getFavStops: function (callback) {
        favstopModel.find({}, callback);
    },
    // getData(busStop, callback) {
    //     var options = {
    //         'method': 'GET',
    //         'url': `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStop}`,
    //         'headers': {
    //             'AccountKey': 'b+8pVHKwRkyLKABbXVxmpQ=='
    //         }
    //     };
    //     request(options, function (error, response) {
    //         if (error) { throw new Error(error) }
    //         else {
    //             //console.log(response.body);
    //             return callback(null, JSON.parse(response.body))
    //         }
    //     });
    // },

    // getTimingForStop(busStop, callback) {
    //     this.getData(busStop, payload => {
    //         payload = payload.Services;
    //         callback({
    //             services: payload.map(service => service.ServiceNo),
    //             timings: payload.reduce((timings, service) => {
    //                 function timingObj(service, type) {
    //                     var arrival = new Date(service[type].EstimatedArrival);
    //                     return {
    //                         arrival: arrival,
    //                         secondsToArrival: Math.floor(Math.max(0, (arrival - +new Date()) / 1000)),
    //                         load: service[type].Load,
    //                         isWAB: service[type].Feature === 'WAB'
    //                     };

    //                 }
    //                 var types = ['NextBus', 'NextBus2', 'NextBus3'];
    //                 timings[service.ServiceNo] = {
    //                     availableBuses: service.NextBus.EstimatedArrival === '' ? 0 : service.NextBus2.EstimatedArrival === '' ? 1 : service.NextBus3.EstimatedArrival === '' ? 2 : 3,
    //                     buses: []
    //                 };
    //                 for (var i = 0; i < timings[service.ServiceNo].availableBuses; i++) {
    //                     timings[service.ServiceNo].buses.push(timingObj(service, types[i]))
    //                 }
    //                 return timings;
    //             }, {})
    //         });
    //     });
    // },

    // getBusServiceData(callback) {
    //         var options = {
    //             'method': 'GET',
    //             'url': `http://datamall2.mytransport.sg/ltaodataservice/BusServices`,
    //             'headers': {
    //                 'AccountKey': 'b+8pVHKwRkyLKABbXVxmpQ=='
    //             }
    //         };
    //         request(options, function (error, response) {
    //             if (error) { throw new Error(error) }
    //             else {
    //             //console.log(response.body);
    //                 return callback(null, jQuery.parseJSON(response))
    //             }
    //         });
    // },

    //     getBusServices(page, callback) {
    //         this.getBusServiceData(page, payload => {
    //             var services = payload.value;
    //             callback(services.map(e => {return {
    //                 serviceNo: e.ServiceNo,
    //                 operator: e.Operator,
    //                 serviceType: e.Category,
    //                 direction: e.Direction
    //             }}));
    //         });
    //     },
};

module.exports = database;