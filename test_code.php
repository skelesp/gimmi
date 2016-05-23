<?php 
//
require_once "./lib/GIMMI/Wishlist.class.php";
require_once "./lib/GIMMI/Person.class.php";
require_once "./lib/GIMMI/PersonRepository.class.php";

$repo = new PersonRepository ();
$persons = $repo->findPerson(null,"Stijn", "Beeckmans");

$person = new Person ($persons[0]['email']);

echo $person;

?>