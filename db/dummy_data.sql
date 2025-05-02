/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.1-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: test
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `age_groups`
--

DROP TABLE IF EXISTS `age_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `age_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `age_groups`
--

/*!40000 ALTER TABLE `age_groups` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `age_groups` ENABLE KEYS */;
commit;

--
-- Table structure for table `bom_accessories`
--

DROP TABLE IF EXISTS `bom_accessories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bom_accessories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `particular` varchar(100) DEFAULT NULL,
  `specification` text DEFAULT NULL,
  `shade_no` varchar(50) DEFAULT NULL,
  `consumption` varchar(100) DEFAULT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `bom_accessories_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bom_accessories`
--

/*!40000 ALTER TABLE `bom_accessories` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `bom_accessories` ENABLE KEYS */;
commit;

--
-- Table structure for table `bom_fabrics`
--

DROP TABLE IF EXISTS `bom_fabrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `bom_fabrics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `fabric` varchar(100) DEFAULT NULL,
  `colour` varchar(50) DEFAULT NULL,
  `tpx` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `bom_fabrics_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bom_fabrics`
--

/*!40000 ALTER TABLE `bom_fabrics` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `bom_fabrics` ENABLE KEYS */;
commit;

--
-- Table structure for table `cutters`
--

DROP TABLE IF EXISTS `cutters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cutters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `whatsapp_no` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cutters`
--

/*!40000 ALTER TABLE `cutters` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `cutters` ENABLE KEYS */;
commit;

--
-- Table structure for table `cutting`
--

DROP TABLE IF EXISTS `cutting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cutting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `cutter_id` int(11) DEFAULT NULL,
  `lot_no` varchar(100) DEFAULT NULL,
  `total_qty` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `cutter_id` (`cutter_id`),
  CONSTRAINT `cutting_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `cutting_ibfk_2` FOREIGN KEY (`cutter_id`) REFERENCES `cutters` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cutting`
--

/*!40000 ALTER TABLE `cutting` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `cutting` ENABLE KEYS */;
commit;

--
-- Table structure for table `cutting_articles`
--

DROP TABLE IF EXISTS `cutting_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cutting_articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cutting_id` int(11) DEFAULT NULL,
  `age_group_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cutting_id` (`cutting_id`),
  KEY `age_group_id` (`age_group_id`),
  CONSTRAINT `cutting_articles_ibfk_1` FOREIGN KEY (`cutting_id`) REFERENCES `cutting` (`id`),
  CONSTRAINT `cutting_articles_ibfk_2` FOREIGN KEY (`age_group_id`) REFERENCES `age_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cutting_articles`
--

/*!40000 ALTER TABLE `cutting_articles` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `cutting_articles` ENABLE KEYS */;
commit;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `sent` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
commit;

--
-- Table structure for table `order_articles`
--

DROP TABLE IF EXISTS `order_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `po_id` int(11) DEFAULT NULL,
  `age_group_id` int(11) DEFAULT NULL,
  `article_no` varchar(100) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `gender` enum('Male','Female','Unisex') DEFAULT NULL,
  `product_photos` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `po_id` (`po_id`),
  KEY `age_group_id` (`age_group_id`),
  CONSTRAINT `order_articles_ibfk_1` FOREIGN KEY (`po_id`) REFERENCES `order_po_qty` (`id`),
  CONSTRAINT `order_articles_ibfk_2` FOREIGN KEY (`age_group_id`) REFERENCES `age_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_articles`
--

/*!40000 ALTER TABLE `order_articles` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `order_articles` ENABLE KEYS */;
commit;

--
-- Table structure for table `order_po_qty`
--

DROP TABLE IF EXISTS `order_po_qty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_po_qty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `combo` varchar(100) DEFAULT NULL,
  `pro_color` varchar(100) DEFAULT NULL,
  `fabric_quality` varchar(100) DEFAULT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `preemie` int(11) DEFAULT NULL,
  `nb` int(11) DEFAULT NULL,
  `total_qty` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_po_qty_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_po_qty`
--

/*!40000 ALTER TABLE `order_po_qty` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `order_po_qty` ENABLE KEYS */;
commit;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(50) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `buyer` varchar(100) DEFAULT NULL,
  `style_no` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `season` varchar(100) DEFAULT NULL,
  `age_group_id` int(11) DEFAULT NULL,
  `shipment_date` date DEFAULT NULL,
  `pattern` text DEFAULT NULL,
  `printing` text DEFAULT NULL,
  `documents` text DEFAULT NULL,
  `steps_required` text DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `deadline_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`unique_id`),
  KEY `age_group_id` (`age_group_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`age_group_id`) REFERENCES `age_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
commit;

--
-- Table structure for table `printers`
--

DROP TABLE IF EXISTS `printers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `printers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `whatsapp_no` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `printers`
--

/*!40000 ALTER TABLE `printers` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `printers` ENABLE KEYS */;
commit;

--
-- Table structure for table `printing`
--

DROP TABLE IF EXISTS `printing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `printing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `challan_no` varchar(100) DEFAULT NULL,
  `printer_id` int(11) DEFAULT NULL,
  `screen_no` varchar(100) DEFAULT NULL,
  `screen_qty` int(11) DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `received_qty` int(11) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `printer_id` (`printer_id`),
  CONSTRAINT `printing_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `printing_ibfk_2` FOREIGN KEY (`printer_id`) REFERENCES `printers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `printing`
--

/*!40000 ALTER TABLE `printing` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `printing` ENABLE KEYS */;
commit;

--
-- Table structure for table `production_stage`
--

DROP TABLE IF EXISTS `production_stage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_stage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `stage` enum('Stitch','Button','Finishing','Packing') DEFAULT NULL,
  `date` date DEFAULT NULL,
  `lot_no` varchar(100) DEFAULT NULL,
  `total_qty` int(11) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `production_stage_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_stage`
--

/*!40000 ALTER TABLE `production_stage` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `production_stage` ENABLE KEYS */;
commit;

--
-- Table structure for table `user_rights`
--

DROP TABLE IF EXISTS `user_rights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_rights` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `module_name` varchar(50) DEFAULT NULL,
  `can_add` tinyint(1) DEFAULT NULL,
  `can_edit` tinyint(1) DEFAULT NULL,
  `can_delete` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_rights_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_rights`
--

/*!40000 ALTER TABLE `user_rights` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `user_rights` ENABLE KEYS */;
commit;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  `whatsapp_no` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('Super Admin','Manager','Normal user') DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `users` VALUES
(1,'Super Admin','None','1234567890','1234567890','email@e.com',NULL,'1234567890','Super Admin','2025-05-02 13:55:17');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
commit;

--
-- Dumping routines for database 'test'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-05-02  9:56:07
