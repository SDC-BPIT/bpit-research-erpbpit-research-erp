-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               12.3.2-MariaDB - MariaDB Server
-- Server OS:                    Win64
-- HeidiSQL Version:             12.17.0.7270
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for bpit_research
CREATE DATABASE IF NOT EXISTS `bpit_research` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `bpit_research`;

-- Dumping structure for table bpit_research.book
CREATE TABLE IF NOT EXISTS `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `affiliation` varchar(191) DEFAULT NULL,
  `role` varchar(191) DEFAULT NULL,
  `authorPosition` varchar(191) DEFAULT NULL,
  `authors` varchar(191) NOT NULL,
  `coAuthorsBPIT` varchar(191) DEFAULT NULL,
  `publisher` varchar(191) NOT NULL,
  `isbn` varchar(191) DEFAULT NULL,
  `year` varchar(191) NOT NULL,
  `publicationMonth` varchar(191) DEFAULT NULL,
  `bookPublished` varchar(191) DEFAULT NULL,
  `edition` varchar(191) DEFAULT NULL,
  `type` varchar(191) DEFAULT NULL,
  `pages` varchar(191) DEFAULT NULL,
  `volume` varchar(191) DEFAULT NULL,
  `sciScie` varchar(191) DEFAULT NULL,
  `esci` varchar(191) DEFAULT NULL,
  `scopus` varchar(191) DEFAULT NULL,
  `doi` varchar(191) DEFAULT NULL,
  `link` varchar(191) DEFAULT NULL,
  `department` varchar(191) NOT NULL,
  `academicYear` varchar(191) NOT NULL,
  `submittedById` int(11) NOT NULL,
  `submittedByName` varchar(191) NOT NULL,
  `submittedAt` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Book_submittedById_fkey` (`submittedById`),
  CONSTRAINT `Book_submittedById_fkey` FOREIGN KEY (`submittedById`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.bookchapter
CREATE TABLE IF NOT EXISTS `bookchapter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `affiliation` varchar(191) DEFAULT NULL,
  `authors` varchar(191) NOT NULL,
  `totalAuthors` varchar(191) DEFAULT NULL,
  `authorPosition` varchar(191) DEFAULT NULL,
  `correspondingAuthor` varchar(191) DEFAULT NULL,
  `phdWork` varchar(191) DEFAULT NULL,
  `supervisorFirstAuthor` varchar(191) DEFAULT NULL,
  `coAuthorsBPIT` varchar(191) DEFAULT NULL,
  `studentDetails` varchar(191) DEFAULT NULL,
  `bookTitle` varchar(191) NOT NULL,
  `editors` varchar(191) DEFAULT NULL,
  `publisher` varchar(191) NOT NULL,
  `isbn` varchar(191) DEFAULT NULL,
  `status` varchar(191) DEFAULT NULL,
  `publicationMonth` varchar(191) DEFAULT NULL,
  `year` varchar(191) NOT NULL,
  `volume` varchar(191) DEFAULT NULL,
  `pageNo` varchar(191) DEFAULT NULL,
  `impactFactor` varchar(191) DEFAULT NULL,
  `sciScie` varchar(191) DEFAULT NULL,
  `esci` varchar(191) DEFAULT NULL,
  `scopus` varchar(191) DEFAULT NULL,
  `scopusQuadrant` varchar(191) DEFAULT NULL,
  `ugcCareListed` varchar(191) DEFAULT NULL,
  `peerReviewed` varchar(191) DEFAULT NULL,
  `doi` varchar(191) DEFAULT NULL,
  `link` varchar(191) DEFAULT NULL,
  `indexed` varchar(191) DEFAULT NULL,
  `department` varchar(191) NOT NULL,
  `academicYear` varchar(191) NOT NULL,
  `submittedById` int(11) NOT NULL,
  `submittedByName` varchar(191) NOT NULL,
  `submittedAt` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `BookChapter_submittedById_fkey` (`submittedById`),
  CONSTRAINT `BookChapter_submittedById_fkey` FOREIGN KEY (`submittedById`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.conference
CREATE TABLE IF NOT EXISTS `conference` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `affiliation` varchar(191) DEFAULT NULL,
  `authors` varchar(191) NOT NULL,
  `totalAuthors` varchar(191) DEFAULT NULL,
  `authorPosition` varchar(191) DEFAULT NULL,
  `correspondingAuthor` varchar(191) DEFAULT NULL,
  `phdWork` varchar(191) DEFAULT NULL,
  `supervisorFirstAuthor` varchar(191) DEFAULT NULL,
  `coAuthorsBPIT` varchar(191) DEFAULT NULL,
  `studentDetails` varchar(191) DEFAULT NULL,
  `conference` varchar(191) NOT NULL,
  `organized` varchar(191) DEFAULT NULL,
  `location` varchar(191) NOT NULL,
  `date` varchar(191) NOT NULL,
  `status` varchar(191) DEFAULT NULL,
  `presentationDate` varchar(191) DEFAULT NULL,
  `presentationMode` varchar(191) DEFAULT NULL,
  `proceedingsPublished` varchar(191) DEFAULT NULL,
  `proceedingsTitle` varchar(191) DEFAULT NULL,
  `proceedingsISBN` varchar(191) DEFAULT NULL,
  `proceedingsPublisher` varchar(191) DEFAULT NULL,
  `publicationMonth` varchar(191) DEFAULT NULL,
  `year` varchar(191) DEFAULT NULL,
  `volume` varchar(191) DEFAULT NULL,
  `issue` varchar(191) DEFAULT NULL,
  `pages` varchar(191) DEFAULT NULL,
  `scopus` varchar(191) DEFAULT NULL,
  `doi` varchar(191) DEFAULT NULL,
  `registrationAmount` varchar(191) DEFAULT NULL,
  `amountSponsoredByBPIT` varchar(191) DEFAULT NULL,
  `indexed` varchar(191) DEFAULT NULL,
  `paperType` varchar(191) DEFAULT NULL,
  `department` varchar(191) NOT NULL,
  `academicYear` varchar(191) NOT NULL,
  `submittedById` int(11) NOT NULL,
  `submittedByName` varchar(191) NOT NULL,
  `submittedAt` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Conference_submittedById_fkey` (`submittedById`),
  CONSTRAINT `Conference_submittedById_fkey` FOREIGN KEY (`submittedById`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.course
CREATE TABLE IF NOT EXISTS `course` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.department
CREATE TABLE IF NOT EXISTS `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Department_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.faculty
CREATE TABLE IF NOT EXISTS `faculty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `title` enum('Mr','Ms','Dr','Prof') DEFAULT NULL,
  `firstName` varchar(191) NOT NULL,
  `middleName` varchar(191) DEFAULT NULL,
  `lastName` varchar(191) DEFAULT NULL,
  `gender` enum('Male','Female','Transgender') DEFAULT NULL,
  `dob` datetime(3) DEFAULT NULL,
  `placeOfBirth` varchar(191) DEFAULT NULL,
  `category` enum('GEN','SC','ST','OBC','EWS','PH') DEFAULT NULL,
  `doj` datetime(3) DEFAULT NULL,
  `dor` datetime(3) DEFAULT NULL,
  `mobile` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `nationality` varchar(191) DEFAULT NULL,
  `aadhaarNo` varchar(191) DEFAULT NULL,
  `panNo` varchar(191) DEFAULT NULL,
  `bloodGroup` varchar(191) DEFAULT NULL,
  `presentAddrHNoFloor` varchar(191) DEFAULT NULL,
  `presentAddrStreetArea` varchar(191) DEFAULT NULL,
  `presentAddrDistrict` varchar(191) DEFAULT NULL,
  `presentAddrCity` varchar(191) DEFAULT NULL,
  `presentAddrCountry` varchar(191) DEFAULT NULL,
  `presentAddrPin` varchar(191) DEFAULT NULL,
  `permanentAddrHNoFloor` varchar(191) DEFAULT NULL,
  `permanentAddrStreetArea` varchar(191) DEFAULT NULL,
  `permanentAddrDistrict` varchar(191) DEFAULT NULL,
  `permanentAddrCity` varchar(191) DEFAULT NULL,
  `permanentAddrCountry` varchar(191) DEFAULT NULL,
  `permanentAddrPin` varchar(191) DEFAULT NULL,
  `presentDesig` varchar(191) DEFAULT NULL,
  `presentDept` varchar(191) DEFAULT NULL,
  `courseId` varchar(191) DEFAULT NULL,
  `specialization` varchar(191) DEFAULT NULL,
  `isOldFaculty` tinyint(1) NOT NULL DEFAULT 0,
  `oldFacultyId` bigint(20) DEFAULT NULL,
  `fatherName` varchar(191) DEFAULT NULL,
  `motherName` varchar(191) DEFAULT NULL,
  `spouseName` varchar(191) DEFAULT NULL,
  `isFyCommonFaculty` tinyint(1) NOT NULL DEFAULT 0,
  `fyCommonSubject` varchar(191) DEFAULT NULL,
  `facultyPhoto` varchar(191) DEFAULT NULL,
  `facultySign` varchar(191) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Faculty_userId_key` (`userId`),
  KEY `Faculty_courseId_fkey` (`courseId`),
  CONSTRAINT `Faculty_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Faculty_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.facultydeptdesig
CREATE TABLE IF NOT EXISTS `facultydeptdesig` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facultyId` int(11) NOT NULL,
  `startDate` datetime(3) DEFAULT NULL,
  `courseId` varchar(191) DEFAULT NULL,
  `designation` varchar(191) DEFAULT NULL,
  `department` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FacultyDeptDesig_facultyId_fkey` (`facultyId`),
  KEY `FacultyDeptDesig_courseId_fkey` (`courseId`),
  CONSTRAINT `FacultyDeptDesig_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `course` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FacultyDeptDesig_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `faculty` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.facultyqualification
CREATE TABLE IF NOT EXISTS `facultyqualification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facultyId` int(11) NOT NULL,
  `degree` varchar(191) DEFAULT NULL,
  `university` varchar(191) DEFAULT NULL,
  `year` varchar(191) DEFAULT NULL,
  `percentage` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FacultyQualification_facultyId_fkey` (`facultyId`),
  CONSTRAINT `FacultyQualification_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `faculty` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.fdp
CREATE TABLE IF NOT EXISTS `fdp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `faculty` varchar(191) NOT NULL,
  `organizer` varchar(191) NOT NULL,
  `sponsor` varchar(191) DEFAULT NULL,
  `mode` varchar(191) NOT NULL,
  `type` varchar(191) DEFAULT NULL,
  `startDate` varchar(191) NOT NULL,
  `endDate` varchar(191) NOT NULL,
  `duration` varchar(191) NOT NULL,
  `certificateNo` varchar(191) DEFAULT NULL,
  `amountSponsoredByBPIT` varchar(191) DEFAULT NULL,
  `department` varchar(191) NOT NULL,
  `academicYear` varchar(191) NOT NULL,
  `submittedById` int(11) NOT NULL,
  `submittedByName` varchar(191) NOT NULL,
  `submittedAt` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FDP_submittedById_fkey` (`submittedById`),
  CONSTRAINT `FDP_submittedById_fkey` FOREIGN KEY (`submittedById`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.journal
CREATE TABLE IF NOT EXISTS `journal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `authors` varchar(191) NOT NULL,
  `journal` varchar(191) NOT NULL,
  `issn` varchar(191) DEFAULT NULL,
  `publisher` varchar(191) DEFAULT NULL,
  `indexed` varchar(191) DEFAULT NULL,
  `volume` varchar(191) DEFAULT NULL,
  `issue` varchar(191) DEFAULT NULL,
  `pages` varchar(191) DEFAULT NULL,
  `year` varchar(191) NOT NULL,
  `impactFactor` varchar(191) DEFAULT NULL,
  `quartile` varchar(191) DEFAULT NULL,
  `affiliation` varchar(191) NOT NULL,
  `totalAuthors` varchar(191) NOT NULL,
  `authorPosition` varchar(191) NOT NULL,
  `correspondingAuthor` varchar(191) NOT NULL,
  `phdWork` varchar(191) NOT NULL,
  `supervisorFirstAuthor` varchar(191) DEFAULT NULL,
  `coAuthorsBPIT` varchar(191) DEFAULT NULL,
  `studentDetails` varchar(191) DEFAULT NULL,
  `publicationMonth` varchar(191) NOT NULL,
  `frequency` varchar(191) DEFAULT NULL,
  `sciScie` varchar(191) DEFAULT NULL,
  `esci` varchar(191) DEFAULT NULL,
  `scopus` varchar(191) DEFAULT NULL,
  `ugcCareListed` varchar(191) DEFAULT NULL,
  `peerReviewed` varchar(191) DEFAULT NULL,
  `citationsWoS` varchar(191) DEFAULT NULL,
  `citationsGoogleScholar` varchar(191) DEFAULT NULL,
  `awardMoney` varchar(191) DEFAULT NULL,
  `doi` varchar(191) DEFAULT NULL,
  `link` varchar(191) DEFAULT NULL,
  `department` varchar(191) DEFAULT NULL,
  `academicYear` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `submittedById` int(11) NOT NULL,
  `submittedByName` varchar(191) NOT NULL,
  `submittedAt` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Journal_submittedById_fkey` (`submittedById`),
  CONSTRAINT `Journal_submittedById_fkey` FOREIGN KEY (`submittedById`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.patent
CREATE TABLE IF NOT EXISTS `patent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(191) NOT NULL,
  `inventors` varchar(191) NOT NULL,
  `applicationNo` varchar(191) NOT NULL,
  `filingDate` varchar(191) NOT NULL,
  `publicationDate` varchar(191) DEFAULT NULL,
  `grantDate` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL,
  `type` varchar(191) DEFAULT NULL,
  `country` varchar(191) NOT NULL,
  `patentNo` varchar(191) DEFAULT NULL,
  `department` varchar(191) NOT NULL,
  `academicYear` varchar(191) NOT NULL,
  `iprValidityGrantYears` varchar(191) DEFAULT NULL,
  `assigneesInstituteAffiliation` varchar(191) DEFAULT NULL,
  `yourAffiliationInIPR` varchar(191) DEFAULT NULL,
  `submittedById` int(11) NOT NULL,
  `submittedByName` varchar(191) NOT NULL,
  `submittedAt` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Patent_submittedById_fkey` (`submittedById`),
  CONSTRAINT `Patent_submittedById_fkey` FOREIGN KEY (`submittedById`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table bpit_research.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'faculty',
  `dept` varchar(191) NOT NULL,
  `facultyId` varchar(191) NOT NULL,
  `resetToken` varchar(191) DEFAULT NULL,
  `resetTokenExpiry` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_facultyId_key` (`facultyId`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
