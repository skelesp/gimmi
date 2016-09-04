angular.module('wishlist.wish.create', [

])
  .config(function($stateProvider){
      $stateProvider
        .state('gimmi.wishlist.newWish', {
          url: '/newWish',
          templateUrl: 'app/wishlist/wish/create/wish-create.tmpl.html',
          controller: 'createWishCtrl as createWishCtrl'
        })
      ;
  })

  .controller('createWishCtrl', function($state, $stateParams, wishModel, receiverModel){
    var createWishCtrl = this;

    function returnToWishes(){
      $state.go('gimmi.wishlist', {
        receiverID: $stateParams.receiverID
      })
    }

    function cancelCreating() {
      returnToWishes();
    }

    function createWish(wish, receiverID) {
      wishModel.createWish(wish, receiverID);
      returnToWishes();
    }

    function resetForm() {
      createWishCtrl.newWish = {
        title: '',
        price: ''
      }
    }

    createWishCtrl.cancelCreating = cancelCreating;
    createWishCtrl.createWish = createWish;

    createWishCtrl.getCurrentReceiverId = receiverModel.getCurrentReceiverId;

    resetForm();

  })
;
