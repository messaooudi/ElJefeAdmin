import angular from 'angular';
import { Meteor } from 'meteor/meteor';


import '/public/CDN/jquery/jquery-3.1.1.min.js'

import '/public/CDN/bootstrap/css/bootstrap.min.css'
import '/public/CDN/bootstrap/js/bootstrap.min.js'

import './font-awesome/css/font-awesome.min.css'


import '/public/CDN/leaftlet/leaflet.min.js'
import '/public/CDN/leaftlet/leaflet.css'


import '/public/CDN/leaflet-routing-machine/js/leaflet-routing-machine.min.js'
import '/public/CDN/leaflet-routing-machine/css/leaflet-routing-machine.css'


import '/public/CDN/Leaflet-awesome-markers/js/leaflet-awesome-markers.min.js'
import '/public/CDN/Leaflet-awesome-markers/css/leaflet-awesome-markers.css'

import '/public/CDN/paho/mqttws31.min.js'


import './index.css';



import { Menu } from '../imports/database/menu';

import { name as Main } from '../imports/components/main/main';


customers = {}
client = new Paho.MQTT.Client('broker.mqttdashboard.com', 8000, "NAYOTGSEIR" + Date.now());
connected = false;


Meteor.startup(function () {
    Meteor.disconnect();

    client.connect({ onSuccess: onConnect });
    function onConnect() {
        client.subscribe("NAYOTSnack/menu/get");
        client.subscribe("NAYOTSnack/client/position");
        alert('connection established')
        connected = true;
    }

    client.onConnectionLost = onConnectionLost;
    function onConnectionLost(responseObject) {
        connected = false;
        alert('connection lost')
        client.connect({ onSuccess: onConnect });
    }

    client.onMessageArrived = onMessageArrived;
    function onMessageArrived(message) {
        switch (message.destinationName) {
            case 'NAYOTSnack/menu/get':
                switch (message.payloadString) {
                    case '0':
                        var message = new Paho.MQTT.Message(JSON.stringify(Menu.find({}).fetch()));
                        message.destinationName = "NAYOTSnack/menu";
                        if (connected)
                            client.send(message);
                        break;
                    case '1':
                        var message = new Paho.MQTT.Message(JSON.stringify(Menu.find({}).fetch()).length + '');
                        message.destinationName = "NAYOTSnack/menu/checksum";
                        if (connected)
                            client.send(message);
                        break;
                    case '2':
                        break;
                }
                break;
            case 'NAYOTSnack/client/position':
                var customer = JSON.parse(message.payloadString);
                customer.time = Date.now()
                customers[customer.id] = customer;
                break;
        }
    }
});


function onReady() {
    angular.bootstrap(document, [
        Main
    ], {
            strictDi: true
        });
}

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
} else {
    angular.element(document).ready(onReady);
}