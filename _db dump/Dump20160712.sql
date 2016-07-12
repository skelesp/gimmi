-- phpMyAdmin SQL Dump
-- version 4.1.14.1
-- http://www.phpmyadmin.net
--
-- Machine: localhost
-- Gegenereerd op: 12 jul 2016 om 20:41
-- Serverversie: 5.1.69
-- PHP-versie: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databank: `gimmi`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `element_instances`
--

CREATE TABLE IF NOT EXISTS `element_instances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `elementDefinitionID` int(11) NOT NULL,
  `processInstanceID` int(11) NOT NULL,
  `executorID` int(11) NOT NULL,
  `status` text,
  `variables` text,
  PRIMARY KEY (`id`),
  KEY `elementDefinitionID` (`elementDefinitionID`),
  KEY `processInstanceID` (`processInstanceID`,`executorID`),
  KEY `executorID` (`executorID`),
  KEY `executorID_2` (`executorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `gifts`
--

CREATE TABLE IF NOT EXISTS `gifts` (
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
  KEY `aGiftFulfillsAWish_idx` (`wishID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `persons`
--

CREATE TABLE IF NOT EXISTS `persons` (
  `personID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(75) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nickname` varchar(45) DEFAULT NULL,
  `login` varchar(45) DEFAULT NULL,
  `pass` varchar(32) DEFAULT NULL,
  `failedLogins` int(11) DEFAULT NULL,
  PRIMARY KEY (`personID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Gegevens worden geëxporteerd voor tabel `persons`
--

INSERT INTO `persons` (`personID`, `firstName`, `lastName`, `email`, `nickname`, `login`, `pass`, `failedLogins`) VALUES
(1, 'Stijn', 'Beeckmans', 'stijn.beeckmans@gmail.com', 'beeckie', 'stijn', 'e2aff55eddad1379a067e2de08b2be7f', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `process_definitions`
--

CREATE TABLE IF NOT EXISTS `process_definitions` (
  `processID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `description` mediumtext,
  `status` varchar(45) DEFAULT NULL,
  `owner` int(11) DEFAULT NULL,
  PRIMARY KEY (`processID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Gegevens worden geëxporteerd voor tabel `process_definitions`
--

INSERT INTO `process_definitions` (`processID`, `name`, `description`, `status`, `owner`) VALUES
(1, 'make a wish', 'This process  helps in adding a wish / gift idea for a certain person.', 'validated', NULL),
(2, 'fulfill a wish', 'This process'' goal is to help someone to find a gift for someone and to make sure it''s bought and given at the right time.', 'validated', NULL),
(3, 'authenticate a user', 'This process controls whether a person has credentials which corresponds to a user.', 'validated', NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `process_elements`
--

CREATE TABLE IF NOT EXISTS `process_elements` (
  `elementID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(45) NOT NULL,
  `serviceID` varchar(50) DEFAULT NULL,
  `procedureID` int(11) DEFAULT NULL,
  PRIMARY KEY (`elementID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- Gegevens worden geëxporteerd voor tabel `process_elements`
--

INSERT INTO `process_elements` (`elementID`, `name`, `type`, `serviceID`, `procedureID`) VALUES
(1, 'authenticate a user', 'activity', NULL, NULL),
(2, 'make a wish', 'activity', NULL, NULL),
(3, 'reserve a wish', 'activity', 'act_reserve_a_wish.php', NULL),
(4, 'search a gift idea', 'activity', 'act_search_a_gift_idea.php', NULL),
(5, 'wants to fulfill a wish of someone', 'trigger', NULL, NULL),
(6, 'wants to communicate wishes', 'trigger', NULL, NULL),
(7, 'wish fulfilled', 'end state', NULL, NULL);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `process_instances`
--

CREATE TABLE IF NOT EXISTS `process_instances` (
  `instanceID` int(11) NOT NULL AUTO_INCREMENT,
  `processID` int(11) NOT NULL,
  `currentElementID` int(11) NOT NULL,
  `currentActorID` int(11) DEFAULT NULL,
  `end_state` varchar(25) NOT NULL,
  `variables` text NOT NULL,
  PRIMARY KEY (`instanceID`),
  KEY `FK_currentElement_idx` (`currentElementID`),
  KEY `FK_process_idx` (`processID`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Gegevens worden geëxporteerd voor tabel `process_instances`
--

INSERT INTO `process_instances` (`instanceID`, `processID`, `currentElementID`, `currentActorID`, `end_state`, `variables`) VALUES
(1, 2, 7, 1, '', '');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `process_structure`
--

CREATE TABLE IF NOT EXISTS `process_structure` (
  `processID` int(11) NOT NULL,
  `elementID` int(11) NOT NULL,
  `nextElementID` int(11) DEFAULT NULL,
  PRIMARY KEY (`processID`,`elementID`),
  KEY `element_idx` (`elementID`),
  KEY `nextElementID_idx` (`nextElementID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Gegevens worden geëxporteerd voor tabel `process_structure`
--

INSERT INTO `process_structure` (`processID`, `elementID`, `nextElementID`) VALUES
(2, 7, NULL),
(2, 4, 3),
(2, 5, 4),
(2, 3, 7);

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `services`
--

CREATE TABLE IF NOT EXISTS `services` (
  `serviceID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) DEFAULT NULL,
  `script` text,
  PRIMARY KEY (`serviceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `wishes`
--

CREATE TABLE IF NOT EXISTS `wishes` (
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
  KEY `personCreatesAWish_idx` (`creatorID`)
) ENGINE=InnoDB  DEFAULT CHARSET=big5 AUTO_INCREMENT=12 ;

--
-- Gegevens worden geëxporteerd voor tabel `wishes`
--

INSERT INTO `wishes` (`wishID`, `name`, `description`, `exampleURL`, `price`, `imageURL`, `status`, `amount`, `deadline`, `visibility`, `ownerID`, `creatorID`) VALUES
(1, 'Test', 'Testbeschrijving', NULL, 10, NULL, NULL, NULL, NULL, NULL, 1, 1),
(2, 'Test2', 'Testbeschrijving2', NULL, 20, NULL, NULL, NULL, NULL, NULL, 1, 1),
(3, 'Test3', 'Testbeschrijving3', NULL, 30, NULL, NULL, NULL, NULL, NULL, 1, 1),
(4, 'Test4', 'Testbeschrijving4', NULL, 40, NULL, NULL, NULL, NULL, NULL, 1, 1),
(5, 'Test5', 'Testbeschrijving5', NULL, 50, NULL, NULL, NULL, NULL, NULL, 1, 1),
(6, 'Test6', 'Testbeschrijving6', NULL, 60, NULL, NULL, NULL, NULL, NULL, 1, 1),
(7, 'Testje', 'testbeschrijving', NULL, 150, NULL, NULL, NULL, NULL, NULL, 1, 1),
(8, 'test', 'test', NULL, 100, NULL, NULL, NULL, NULL, NULL, 1, 1),
(9, 'Test123', 'beschrijving 123', NULL, 123, NULL, NULL, NULL, NULL, NULL, 1, 1),
(10, '1', '2', NULL, 3, NULL, NULL, NULL, NULL, NULL, 1, 1),
(11, 'test wens', 'Dit is een test wens', NULL, 11894, NULL, NULL, NULL, NULL, NULL, 1, 1);

--
-- Beperkingen voor geëxporteerde tabellen
--

--
-- Beperkingen voor tabel `element_instances`
--
ALTER TABLE `element_instances`
  ADD CONSTRAINT `FK_elementDefinition` FOREIGN KEY (`elementDefinitionID`) REFERENCES `process_elements` (`elementID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_ExecutorPerson` FOREIGN KEY (`executorID`) REFERENCES `persons` (`personID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_ProcessInstance` FOREIGN KEY (`processInstanceID`) REFERENCES `process_instances` (`instanceID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Beperkingen voor tabel `gifts`
--
ALTER TABLE `gifts`
  ADD CONSTRAINT `aGiftFulfillsAWish` FOREIGN KEY (`wishID`) REFERENCES `wishes` (`wishID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `PersonGivesAGift` FOREIGN KEY (`giverID`) REFERENCES `persons` (`personID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Beperkingen voor tabel `process_instances`
--
ALTER TABLE `process_instances`
  ADD CONSTRAINT `FK_currentElement` FOREIGN KEY (`currentElementID`) REFERENCES `process_elements` (`elementID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_process` FOREIGN KEY (`processID`) REFERENCES `process_definitions` (`processID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `process_structure`
--
ALTER TABLE `process_structure`
  ADD CONSTRAINT `element` FOREIGN KEY (`elementID`) REFERENCES `process_elements` (`elementID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `nextElementID` FOREIGN KEY (`nextElementID`) REFERENCES `process_elements` (`elementID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `process` FOREIGN KEY (`processID`) REFERENCES `process_definitions` (`processID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Beperkingen voor tabel `wishes`
--
ALTER TABLE `wishes`
  ADD CONSTRAINT `personCreatesAWish` FOREIGN KEY (`creatorID`) REFERENCES `persons` (`personID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `personHasAWish` FOREIGN KEY (`ownerID`) REFERENCES `persons` (`personID`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
