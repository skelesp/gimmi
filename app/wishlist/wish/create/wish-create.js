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

  .controller('createWishCtrl', function($state, $stateParams, wishModel, receiverModel, UserService){
    var createWishCtrl = this;

    function returnToWishes(){
      $state.go('gimmi.wishlist', {
        receiverID: $stateParams.receiverID
      })
    }

    function cancelCreating() {
      returnToWishes();
    }

    function createWish(wish, receiverID, userID) {
      wishModel.createWish(wish, receiverID, userID);
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

    createWishCtrl.currentReceiverID = receiverModel.getCurrentReceiver()._id;
    createWishCtrl.currentUserID = UserService.getCurrentUser()._id;

    resetForm();

  })
;
