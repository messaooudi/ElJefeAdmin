import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
import { Menu } from '../../database/menu';


//import html and css files of this component
import mobileTemplate from './mobile.html';
import './mobile.css';


class MenuListAdd {
    constructor($scope, $reactive, $state) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;



        /*
            the logic of the component should be encapsuled here 
         */

        vm.newItem = {
            categorie: "",
            intitulee: "",
            ingredients: "",
            prix: "",
            imgURL : ''
        }

        vm.ajouter = () => {
            Menu.insert(vm.newItem);
            $state.go('menuList.view')
        }

        vm.init = () => {

        }
    }
}

const name = 'menuListAdd';
const template = mobileTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
]).component(name, {
    template,
    controllerAs: name,
    controller: MenuListAdd
})