angular.module('gcse',[
  'ui.bootstrap',
  'gimmi.config'
])
  .directive('googleImageSearch', ['$uibModal', 'gcseService', 'CONFIG', 'Flash', function($uibModal, gcseService, CONFIG, Flash){
      return {
        scope: {
          searchTerm: '@',
          imageResult: '=',
          onImageSelect: '&',
          onCancel: '&' 
        },
        replace: false,
        restrict: 'AE',
        link: function ($scope, $element, $attrs) {
          $element.on('click', function(){
            var googleImages = [];
            var query = $scope.searchTerm;

            if (query){ //Search query has been entered
      				gcseService.getImageLinks(query).then(function (results) {
    						googleImages = results;

                var popup = $uibModal.open({
                  ariaLabelledBy: 'modal-title',
      			      ariaDescribedBy: 'modal-body',
                  templateUrl: 'app/gcse/gcse-popup.html',
                  controller: 'popupController',
                  controllerAs: 'popupCtrl',
                  animation: true,
                  size: 'lg|sm',
                  resolve: {
                    images: function () {
                      return googleImages;
                    }
                  }
                }).result
                .then(function (selectedImage) {
                  $scope.imageResult.image = selectedImage;
                  if ($scope.onImageSelect) {
                    $scope.onImageSelect();
                  }
                })
                .catch(function () {
                  if ($scope.onCancel) {
                    $scope.onCancel();
                  }
                });
              });
            } else {
              console.error("Geen zoekterm beschikbaar");
              Flash.create("warning", "Er is een titel nodig om een afbeelding te zoeken.")
            }
        });
      }
    };
  }]);
