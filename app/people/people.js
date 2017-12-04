angular.module('gimmi.person')
    .config(['$stateProvider', function($stateProvider){
        $stateProvider
            .state('gimmi.person', {
                url: 'person/:personID',
                views: {
                    'content@': {
                        templateUrl: '/app/people/personDetail.tmpl.html',
                        controller: 'personCtrl as personCtrl'
                    }
                },
                resolve: {
                    person: ['$stateParams', 'PersonService', function ($stateParams, PersonService) {
                        return PersonService.getPersonFromID($stateParams.personID);
                    }]
                }
            })
    }])
    .controller('personCtrl', ['uibDateParser', 'Flash', 'PersonService', 'person', function (uibDateParser, Flash, PersonService, person) {
        var _self = this;
        person.birthday = new Date(person.birthday); //Dit moet in de personService aangepast worden!!
        _self.person = person;
        _self.datePickerOpen = false;
        _self.password = "";
        _self.passwordRepeat = "";
        _self.hasFacebookAccount = function(){
            if (_self.person.accounts.facebook) {
                return true;
            } else{
                return false;
            }
        }
        _self.hasLocalAccount = function () {
            if (_self.person.accounts.local) {
                return true;
            } else {
                return false;
            }
        }
        _self.savePersonDetails = function(){
            _self.personSaved = true;
            PersonService.updatePersonDetails(_self.person).then(function(person){
                console.log("Updated person :", person);
                Flash.create('success', "Uw gegevens zijn bijgewerkt.");
            });
        }
        _self.saveLocalAccount = function(){
            console.log("new password = " + _self.password);
            Flash.create('success', "Uw paswoord voor uw Gimmi-account is bijgewerkt.")
        }
        _self.unlinkFacebookAccount = function(){
            console.log(_self.person.facebook);
            Flash.create('success', "Uw Facebook-account is ontkoppeld.")
        }
    }])
;