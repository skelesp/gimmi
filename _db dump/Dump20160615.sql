CREATE DATABASE  IF NOT EXISTS `gimmi` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `gimmi`;
-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: localhost    Database: gimmi
-- ------------------------------------------------------
-- Server version	5.7.9-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `gifts`
--

DROP TABLE IF EXISTS `gifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gifts` (
  `giftID` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `status` varchar(20) DEFAULT NULL,
  `giftdate` datetime DEFAULT NULL,
  `evaluation` int(11) DEFAULT NULL,
  `wishID` int(11) DEFAULT NULL,
  `giverID` int(11) DEFAULT NULL,
  PRIMARY KEY (`giftID`),
  KEY `PersonGivesAGift_idx` (`giverID`),
  KEY `aGiftFulfillsAWish_idx` (`wishID`),
  CONSTRAINT `PersonGivesAGift` FOREIGN KEY (`giverID`) REFERENCES `persons` (`personID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `aGiftFulfillsAWish` FOREIGN KEY (`wishID`) REFERENCES `wishes` (`wishID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gifts`
--

LOCK TABLES `gifts` WRITE;
/*!40000 ALTER TABLE `gifts` DISABLE KEYS */;
/*!40000 ALTER TABLE `gifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persons`
--

DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `persons` (
  `personID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(75) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nickname` varchar(45) DEFAULT NULL,
  `login` varchar(45) DEFAULT NULL,
  `pass` varchar(32) DEFAULT NULL,
  `failedLogins` int(11) DEFAULT NULL,
  PRIMARY KEY (`personID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persons`
--

LOCK TABLES `persons` WRITE;
/*!40000 ALTER TABLE `persons` DISABLE KEYS */;
INSERT INTO `persons` VALUES (1,'Stijn','Beeckmans','stijn.beeckmans@gmail.com','beeckie','stijn','e2aff55eddad1379a067e2de08b2be7f',NULL);
/*!40000 ALTER TABLE `persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `process_definitions`
--

DROP TABLE IF EXISTS `process_definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `process_definitions` (
  `processID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` mediumtext,
  `status` varchar(45) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  PRIMARY KEY (`processID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `process_definitions`
--

LOCK TABLES `process_definitions` WRITE;
/*!40000 ALTER TABLE `process_definitions` DISABLE KEYS */;
INSERT INTO `process_definitions` VALUES (1,'make a wish','This process  helps in adding a wish / gift idea for a certain person.','validated',NULL),(2,'fulfill a wish','This process\' goal is to help someone to find a gift for someone and to make sure it\'s bought and given at the right time.','validated',NULL),(3,'authenticate a user','This process controls whether a person has credentials which corresponds to a user.','validated',NULL);
/*!40000 ALTER TABLE `process_definitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `process_elements`
--

DROP TABLE IF EXISTS `process_elements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `process_elements` (
  `elementID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(45) NOT NULL,
  `serviceID` int(11) DEFAULT NULL,
  `procedureID` int(11) DEFAULT NULL,
  PRIMARY KEY (`elementID`),
  KEY `FK_service_idx` (`serviceID`),
  CONSTRAINT `FK_service` FOREIGN KEY (`serviceID`) REFERENCES `services` (`serviceID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `process_elements`
--

LOCK TABLES `process_elements` WRITE;
/*!40000 ALTER TABLE `process_elements` DISABLE KEYS */;
INSERT INTO `process_elements` VALUES (1,'authenticate a user','activity',NULL,NULL),(2,'make a wish','activity',NULL,NULL),(3,'reserve a wish','activity',NULL,NULL),(4,'search a gift idea','activity',NULL,NULL),(5,'wants to fulfill a wish of someone','trigger',NULL,NULL),(6,'wants to communicate wishes','trigger',NULL,NULL),(7,'wish fulfilled','end state',NULL,NULL);
/*!40000 ALTER TABLE `process_elements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `process_instances`
--

DROP TABLE IF EXISTS `process_instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `process_instances` (
  `instanceID` int(11) NOT NULL AUTO_INCREMENT,
  `processID` int(11) NOT NULL,
  `currentElementID` int(11) NOT NULL,
  `currentActorID` int(11) DEFAULT NULL,
  PRIMARY KEY (`instanceID`),
  KEY `FK_currentElement_idx` (`currentElementID`),
  KEY `FK_process_idx` (`processID`),
  CONSTRAINT `FK_currentElement` FOREIGN KEY (`currentElementID`) REFERENCES `process_elements` (`elementID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_process` FOREIGN KEY (`processID`) REFERENCES `process_definitions` (`processID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `process_instances`
--

LOCK TABLES `process_instances` WRITE;
/*!40000 ALTER TABLE `process_instances` DISABLE KEYS */;
/*!40000 ALTER TABLE `process_instances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `process_structure`
--

DROP TABLE IF EXISTS `process_structure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `process_structure` (
  `processID` int(11) NOT NULL,
  `elementID` int(11) NOT NULL,
  `nextElementID` int(11) DEFAULT NULL,
  PRIMARY KEY (`processID`,`elementID`),
  KEY `element_idx` (`elementID`),
  KEY `nextElementID_idx` (`nextElementID`),
  CONSTRAINT `element` FOREIGN KEY (`elementID`) REFERENCES `process_elements` (`elementID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `nextElementID` FOREIGN KEY (`nextElementID`) REFERENCES `process_elements` (`elementID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `process` FOREIGN KEY (`processID`) REFERENCES `process_definitions` (`processID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `process_structure`
--

LOCK TABLES `process_structure` WRITE;
/*!40000 ALTER TABLE `process_structure` DISABLE KEYS */;
INSERT INTO `process_structure` VALUES (2,7,NULL),(2,4,3),(2,5,4),(2,3,7);
/*!40000 ALTER TABLE `process_structure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `serviceID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `script` text,
  PRIMARY KEY (`serviceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishes`
--

DROP TABLE IF EXISTS `wishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wishes` (
  `wishID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `exampleURL` text,
  `price` int(11) DEFAULT NULL,
  `imageURL` text,
  `status` varchar(20) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `visibility` varchar(20) DEFAULT NULL,
  `ownerID` int(11) DEFAULT NULL,
  `creatorID` int(11) DEFAULT NULL,
  PRIMARY KEY (`wishID`),
  KEY `personHasAWish_idx` (`ownerID`),
  KEY `personCreatesAWish_idx` (`creatorID`),
  CONSTRAINT `personCreatesAWish` FOREIGN KEY (`creatorID`) REFERENCES `persons` (`personID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `personHasAWish` FOREIGN KEY (`ownerID`) REFERENCES `persons` (`personID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=big5;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishes`
--

LOCK TABLES `wishes` WRITE;
/*!40000 ALTER TABLE `wishes` DISABLE KEYS */;
INSERT INTO `wishes` VALUES (1,'Test','Testbeschrijving',NULL,10,NULL,NULL,NULL,NULL,NULL,1,1),(2,'Test2','Testbeschrijving2',NULL,20,NULL,NULL,NULL,NULL,NULL,1,1),(3,'Test3','Testbeschrijving3',NULL,30,NULL,NULL,NULL,NULL,NULL,1,1),(4,'Test4','Testbeschrijving4',NULL,40,NULL,NULL,NULL,NULL,NULL,1,1),(5,'Test5','Testbeschrijving5',NULL,50,NULL,NULL,NULL,NULL,NULL,1,1),(6,'Test6','Testbeschrijving6',NULL,60,NULL,NULL,NULL,NULL,NULL,1,1),(7,'Testje','testbeschrijving',NULL,150,NULL,NULL,NULL,NULL,NULL,1,1),(8,'test','test',NULL,100,NULL,NULL,NULL,NULL,NULL,1,1),(9,'Test123','beschrijving 123',NULL,123,NULL,NULL,NULL,NULL,NULL,1,1),(10,'1','2',NULL,3,NULL,NULL,NULL,NULL,NULL,1,1),(11,'test wens','Dit is een test wens',NULL,11894,NULL,NULL,NULL,NULL,NULL,1,1);
/*!40000 ALTER TABLE `wishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'gimmi'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-15  8:07:31
