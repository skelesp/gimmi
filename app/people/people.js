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
                },
                authenticate: true
            })
    }])
    .controller('personCtrl', ['$uibModal', 'uibDateParser', 'Flash', 'PersonService', 'person', function ($uibModal, uibDateParser, Flash, PersonService, person) {
        var _self = this;
        if (person.birthday) {
            person.birthday = new Date(person.birthday); //Dit moet in de personService aangepast worden!!
        }
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
            PersonService.updatePersonDetails(_self.person)
            .then(function(person){
                Flash.create('success', "Uw gegevens zijn bijgewerkt.");
                _self.person = person;
            }, function(error){
                Flash.create('danger', error);
            });
        }
        _self.saveLocalPassword = function(){
            PersonService.updatePassword(_self.person, _self.password)
            .then(function(person){
                _self.password = _self.passwordRepeat = "";
            });
        }
        _self.unlinkFacebookAccount = function(){
            var unlinkFBpopup = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'unlinkFBpopup.html',
                size: 'lg',
                controller: 'unlinkFacebookCtrl',
                controllerAs: 'unlinkFacebookCtrl',
                resolve: {
                    hasLocalAccount : function () {
                        return _self.hasLocalAccount();
                    },
                    email : function() {
                        return _self.person.email;
                    }
                }
            });

            unlinkFBpopup.result.then(function(pw){
                if (!_self.hasLocalAccount()){
                    PersonService.updatePassword(_self.person, pw)
                        .then(function (person) {
                            _self.person = person;
                            PersonService.deleteFacebookAccount(_self.person);
                        });
                } else {
                    PersonService.deleteFacebookAccount(_self.person);
                }
                delete _self.person.accounts.facebook;
            });
        }
    }])
    .controller('unlinkFacebookCtrl', ['$uibModalInstance', 'hasLocalAccount' , 'email' , function (modal, hasLocalAccount, email){
        var _self = this;
        _self.hasLocalAccount = hasLocalAccount;
        _self.email = email;
        _self.password = "";
        _self.passwordRepeat = "";
        
        _self.ok = function () {
            modal.close(_self.password);
        };
        _self.cancel = function () {
            modal.dismiss('cancel');
        };
    }]);
;