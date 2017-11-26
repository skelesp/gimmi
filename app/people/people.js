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
    .controller('personCtrl', function (uibDateParser, Flash, person) {
        var _self = this;
        person.birthday = new Date(person.birthday); //Dit moet in de personService aangepast worden!!
        _self.person = person;
        _self.datePickerOpen = false;
        _self.savePersonDetails = function(){
            console.log(_self.person);
            Flash.create('success', "Uw gegevens zijn bijgewerkt.")
        }
        _self.saveLocalAccount = function(){
            console.log(_self.person.local);
            Flash.create('success', "Uw Gimmi-account is bijgewerkt.")
        }
        _self.unlinkFacebookAccount = function(){
            console.log(_self.person.facebook);
            Flash.create('success', "Uw Facebook-account is ontkoppeld.")
        }
    })
;