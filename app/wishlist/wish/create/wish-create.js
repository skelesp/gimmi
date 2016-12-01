angular.module('wishlist.wish.create', [

])
// Voorlopig wordt deze state niet gebruikt, maar wordt nog niet verwijderd.
// Misschien kan dit in de toekomst toch nog nuttig zijn.
  .config(function($stateProvider){
      $stateProvider
        .state('gimmi.wishlist.newWish', {
          url: '/newWish',
          templateUrl: 'app/wishlist/wish/create/wish-create.tmpl.html',
          controller: 'createWishCtrl as createWishCtrl'
        })
      ;
  })
;
