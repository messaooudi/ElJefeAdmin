import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'



//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';


//import html and css files of this component
import mobileTemplate from './mobile.html';
import './mobile.css';


class Map {
    constructor($scope, $reactive) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        L.Icon.Default.imagePath = 'packages/bevanhunt_leaflet/images';



        var currentMarkerIcon = L.AwesomeMarkers.icon({
            prefix: 'fa',
            icon: 'fa-cutlery',
            markerColor: 'red'
        });
        let currentMarker = L.marker([34.68139, -1.90858], { icon: currentMarkerIcon ,zIndexOffset: 95})

        var customerMarkerIcon = L.AwesomeMarkers.icon({
            prefix: 'fa',
            icon: 'fa-user',
            markerColor: 'blue'
        });
        let customersMarkes = [];
        let markersLayer = L.featureGroup();
        setInterval(() => {
            markersLayer.clearLayers();
            for (let id in customers) {
                if (L.latLng(customers[id].latitude, customers[id].longitude).distanceTo(L.latLng(vm.current.latitude, vm.current.longitude)) > 10)
                    markersLayer.addLayer(L.marker([customers[id].latitude, customers[id].longitude], { icon: customerMarkerIcon }))
            }
            customers = {};
        }, 6000)

        vm.helpers({
            current() {
                let pos = Location.getReactivePosition() || Location.getLastPosition() || { latitude: 34.68139, longitude: -1.90858 };
                let message = new Paho.MQTT.Message(JSON.stringify({ latitude: pos.latitude, longitude: pos.longitude }));
                message.destinationName = "NAYOTSnack/position";
                if (connected)
                    client.send(message);
                currentMarker.setLatLng([pos.latitude, pos.longitude]);
                currentMarker.update();
                return pos;
            }
        });

        //Map SetUp
        let map = L.map('map', { zoomControl: false });
        L.control.zoom({
            position: 'topright'
        }).addTo(map);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWVzc2FvdWRpb3Vzc2FtYSIsImEiOiJjaXQ2MjBqdHQwMDFsMnhxYW9hOW9tcHZoIn0.uX-ZR_To6tzxUpXmaVKOnQ', {
        }).addTo(map);
        map.once('load', () => {
            currentMarker.addTo(map);
            markersLayer.addTo(map)
        }).setView([vm.current.latitude, vm.current.longitude], 13);

        vm.location = () => {
            map.panTo([vm.current.latitude, vm.current.longitude])
        }

        /*
            the logic of the component should be encapsuled here 
         */

    }
}

const name = 'map';
const template = mobileTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
]).component(name, {
    template,
    controllerAs: name,
    controller: Map
})