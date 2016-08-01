angular.module('wishlist.wish.edit', [

])
  .config(function($stateProvider){
    $stateProvider
      .state('gimmi.wishlist.wish.edit', {
        url: '/wish/:wishID/edit',
        templateUrl: 'app/wishlist/wish/edit/wish-edit.tmpl.html',
        controller: 'editWishCtrl as editWishCtrl'
      })
    ;
  })

  .controller('editWishCtrl', function ($state, $stateParams, wishModel) {

    var editWishCtrl = this;

    function returnToWishes(){
      $state.go('gimmi.wishlist.wish', {
        receiverName: $stateParams.receiverName
      })
    }

    function cancelEditing() {
      returnToWishes();
    }

    function updateWish() {
      editWishCtrl.wish = angular.copy(editWishCtrl.editedWish);
      wishModel.updateWish(editWishCtrl.wish);
      returnToWishes();
    }

    wishModel.getWishById($stateParams.wishID)
      .then(function(wish){
        if (wish) {
          editWishCtrl.wish = wish;
          //Create a copy to have a temp wish to save all changes before updating
          editWishCtrl.editedWish = angular.copy(editWishCtrl.wish);
        } else {
          returnToWishes();
        }
      });

      editWishCtrl.cancelEditing = cancelEditing;
      editWishCtrl.updateWish = updateWish;

  })
;
