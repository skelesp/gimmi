angular.module('gcse')
.controller('popupController', ['$uibModalInstance','images', function($uibModalInstance, images){
  var _self = this;
  _self.images = images;
  _self.selected = {
    image: _self.images[0]
  };

  _self.clickOnImage = function(selectedImage){
    $uibModalInstance.close(selectedImage);
  };
  _self.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  }
}]);
