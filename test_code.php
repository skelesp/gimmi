<?php 
//
require_once "./lib/GIMMI/Wishlist.class.php";
require_once "./lib/GIMMI/Person.class.php";

$person = new Person (null, "stijn");
$wishlist = new Wishlist($person);

foreach ($wishlist->getWishes() as $wish){
}

?>