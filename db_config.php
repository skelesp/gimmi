<?php
$db = array ( 
    'host' => 'localhost', 
    'user' => 'root', 
    'pass' => 'SidewindeR', 
    'dbname' => 'gimmi'
); 

try 
{ 
    $db = new PDO('mysql:host='.$db['host'].';dbname='.$db['dbname'], $db['user'], $db['pass']); 
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
    $db->query("SET SESSION sql_mode = 'ANSI,ONLY_FULL_GROUP_BY'"); 
} 
catch(PDOException $e) 
{ 
    $sMsg = '<p> 
            Regelnummer: '.$e->getLine().'<br /> 
            Bestand: '.$e->getFile().'<br /> 
            Foutmelding: '.$e->getMessage().' 
        </p>'; 
     
    trigger_error($sMsg); 
}
?>