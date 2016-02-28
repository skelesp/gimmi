<?php
require_once '/db_config.php'; 

try 
{ 
    $sQuery = " 
        SELECT 
            * 
        FROM 
            persons
    "; 
     
    $oStmt = $db->prepare($sQuery); 
    $oStmt->execute(); 
     
	 
	// EXTRA UITLEG
	// Tot aan de while-loop zal alles je redelijk bekend voorkomen. Wat we in de while loop doen is de PDO variant van mysql_fetch_assoc(). Met behulp van de fetch() methode kunnen we rij voor rij uit de resultaat set fetchen. Door de constante PDO::FETCH_ASSOC mee te geven, is het resultaat een associatieve array waarin de kolomnamen de keys vormen.

	// Wat opvalt is dat PDO geen functie als mysql_num_rows() kent en we dus niet zomaar kunnen zien of er records in de resultaat set zitten. Om toch het aantal rijen dat opgehaald wordt te bepalen zouden we eerste een SELECT query met COUNT() uit kunnen voeren. Een andere manier is alle resultaten eerst met de fetchAll() methode in een array te zetten en vervolgens de PHP functie count() te gebruiken.
	// END - EXTRA UITLEG
	
    while($aRow = $oStmt->fetch(PDO::FETCH_ASSOC)) 
    { 
        echo $aRow['email'].'<br />'; 
		echo $aRow['nickname'].'<br />';
    } 
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