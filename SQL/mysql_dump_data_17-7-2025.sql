-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: school_db_new
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `examblock`
--

DROP TABLE IF EXISTS `examblock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `examblock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `block_code` varchar(3) NOT NULL,
  `subject1` varchar(20) NOT NULL,
  `subject2` varchar(20) NOT NULL,
  `subject3` varchar(20) NOT NULL,
  `field_study` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examblock`
--

LOCK TABLES `examblock` WRITE;
/*!40000 ALTER TABLE `examblock` DISABLE KEYS */;
INSERT INTO `examblock` VALUES (41,'A00','Toán','Lý','Hóa','Kỹ thuật, CNTT, Công nghệ, Kinh tế'),(42,'A01','Toán','Lý','Ngoại ngữ','Kỹ thuật, CNTT, Thương mại, Kinh tế'),(43,'A02','Toán','Lý','Sinh','Khoa học tự nhiên, Nông nghiệp'),(44,'A03','Toán','Lý','Sử','Luật, Khoa học xã hội'),(45,'A04','Toán','Lý','Địa','Địa chất, Địa lý học, Kinh tế vùng'),(46,'B00','Toán','Hóa','Sinh','Y – Dược, Nông nghiệp, Sinh học ứng dụng'),(47,'B01','Toán','Sinh','Sử','Giáo dục, Khoa học xã hội'),(48,'B02','Toán','Sinh','Địa','Địa sinh học, Nông nghiệp'),(49,'C00','Văn','Sử','Địa','Sư phạm xã hội, Luật, Báo chí'),(50,'C01','Văn','Toán','Lý','Luật, Quản lý, Khoa học xã hội'),(51,'C02','Văn','Toán','Hóa','Kinh tế, Luật, Giáo dục'),(52,'C03','Văn','Toán','Sử','Luật, Chính trị học, Giáo dục'),(53,'C04','Văn','Toán','Địa','Báo chí, Du lịch, Quản trị'),(54,'D01','Văn','Toán','Ngoại ngữ','Ngoại ngữ, Kinh tế, Quốc tế học'),(55,'D07','Toán','Hóa','Ngoại ngữ','Quản trị, Kỹ thuật, Công nghệ thực phẩm'),(56,'D14','Văn','Sử','Ngoại ngữ','Sư phạm, Du lịch, Quốc tế học'),(57,'D15','Văn','Địa','Ngoại ngữ','Báo chí, Quan hệ công chúng, Du lịch'),(58,'X26','Toán','Tin','Ngoại ngữ',''),(59,'X56','Toán','Tin','CNCN',''),(60,'X20','Toán','Sử','CNNN','');
/*!40000 ALTER TABLE `examblock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scoreavg`
--

DROP TABLE IF EXISTS `scoreavg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scoreavg` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `year` varchar(4) NOT NULL,
  `math_score` float DEFAULT NULL,
  `literature_score` float DEFAULT NULL,
  `physics_score` float DEFAULT NULL,
  `chemistry_score` float DEFAULT NULL,
  `biology_score` float DEFAULT NULL,
  `history_score` float DEFAULT NULL,
  `geography_score` float DEFAULT NULL,
  `civic_education_score` float DEFAULT NULL,
  `cs_score` float DEFAULT NULL,
  `itech_score` float DEFAULT NULL,
  `atech_score` float DEFAULT NULL,
  `foreign_language_score` float DEFAULT NULL,
  `foreign_language` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scoreavg`
--

LOCK TABLES `scoreavg` WRITE;
/*!40000 ALTER TABLE `scoreavg` DISABLE KEYS */;
INSERT INTO `scoreavg` VALUES (1,'Quốc gia','2025',6.45,7.23,6.67,6.68,6.28,6.57,7.19,8.16,7,7,7,5.51,'Anh'),(2,'Hà nội','2025',6.75,7.76,6.81,6.22,5.91,6.62,7.06,8.12,8,8,8,6.2,'Anh');
/*!40000 ALTER TABLE `scoreavg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `class_name` varchar(20) NOT NULL,
  `cmnd` varchar(12) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `dob` varchar(10) DEFAULT NULL,
  `birth_place` varchar(100) DEFAULT NULL,
  `ethnicity` varchar(50) DEFAULT NULL,
  `math_score` float DEFAULT NULL,
  `literature_score` float DEFAULT NULL,
  `physics_score` float DEFAULT NULL,
  `chemistry_score` float DEFAULT NULL,
  `biology_score` float DEFAULT NULL,
  `history_score` float DEFAULT NULL,
  `geography_score` float DEFAULT NULL,
  `civic_education_score` float DEFAULT NULL,
  `cs_score` float DEFAULT NULL,
  `itech_score` float DEFAULT NULL,
  `atech_score` float DEFAULT NULL,
  `foreign_language_score` float DEFAULT NULL,
  `foreign_language` varchar(10) DEFAULT NULL,
  `site` varchar(50) DEFAULT NULL,
  `council_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cmnd` (`cmnd`)
) ENGINE=InnoDB AUTO_INCREMENT=1525 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teachers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `subject` varchar(50) NOT NULL,
  `class_name` varchar(20) NOT NULL,
  `year` varchar(4) NOT NULL,
  `site` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `site` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'admin','$2b$12$VTr/Qv7lOVR/ZpAFCqkhUuf1xmIixwD5YqrA1Q.p3L4XvaOL0urvC','admin','Cơ sở Hà Nội'),(4,'demo','$2b$12$d52ap6mJ89X0AGyamxzas.jBlSapYYabFtYMwc5D6t951d5pMfRdy','admin','Trần Phú - Hoàn Kiếm');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'school_db_new'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_subject_teacher_report` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_subject_teacher_report`(

    IN in_year VARCHAR(4),

    IN in_site VARCHAR(50)

)
BEGIN

    SELECT

        c.subject, c.teacher_name, c.class_name, c.avg_score_class,

        c.max_score_class, c.min_score_class, 

        t.avg_score_teacher, t.max_score_teacher, t.min_score_teacher

    FROM (

        SELECT

            t.subject,

            t.name AS teacher_name,

            s.class_name,

            ROUND(AVG(CASE t.subject

                WHEN 'Toán' THEN s.math_score

                WHEN 'Văn' THEN s.literature_score

                WHEN 'Lý' THEN s.physics_score

                WHEN 'Hóa' THEN s.chemistry_score

                WHEN 'Sinh' THEN s.biology_score

                WHEN 'Sử' THEN s.history_score

                WHEN 'Địa' THEN s.geography_score

                WHEN 'GDCD' THEN s.civic_education_score

                WHEN 'Tin' THEN s.cs_score

                WHEN 'CNCN' THEN s.itech_score

                WHEN 'CNNN' THEN s.atech_score

                WHEN 'Ngoại ngữ' THEN s.foreign_language_score

                ELSE NULL

            END), 2) AS avg_score_class,

            MAX(CASE t.subject

                WHEN 'Toán' THEN s.math_score

                WHEN 'Văn' THEN s.literature_score

                WHEN 'Lý' THEN s.physics_score

                WHEN 'Hóa' THEN s.chemistry_score

                WHEN 'Sinh' THEN s.biology_score

                WHEN 'Sử' THEN s.history_score

                WHEN 'Địa' THEN s.geography_score

                WHEN 'GDCD' THEN s.civic_education_score

                WHEN 'Tin' THEN s.cs_score

                WHEN 'CNCN' THEN s.itech_score

                WHEN 'CNNN' THEN s.atech_score

                WHEN 'Ngoại ngữ' THEN s.foreign_language_score

                ELSE NULL                

            END) AS max_score_class,

            MIN(CASE t.subject

                WHEN 'Toán' THEN s.math_score

                WHEN 'Văn' THEN s.literature_score

                WHEN 'Lý' THEN s.physics_score

                WHEN 'Hóa' THEN s.chemistry_score

                WHEN 'Sinh' THEN s.biology_score

                WHEN 'Sử' THEN s.history_score

                WHEN 'Địa' THEN s.geography_score

                WHEN 'GDCD' THEN s.civic_education_score

                WHEN 'Tin' THEN s.cs_score

                WHEN 'CNCN' THEN s.itech_score

                WHEN 'CNNN' THEN s.atech_score

                WHEN 'Ngoại ngữ' THEN s.foreign_language_score

                ELSE NULL

            END) AS min_score_class

        FROM students s

        JOIN teachers t

            ON s.class_name = t.class_name AND s.site = t.site

        WHERE t.year = in_year AND t.site = in_site

        GROUP BY t.subject, s.class_name, t.name

    ) c

    JOIN (

        SELECT

            t.subject,

            t.name AS teacher_name,

            ROUND(AVG(CASE t.subject

                WHEN 'Toán' THEN s.math_score

                WHEN 'Văn' THEN s.literature_score

                WHEN 'Lý' THEN s.physics_score

                WHEN 'Hóa' THEN s.chemistry_score

                WHEN 'Sinh' THEN s.biology_score

                WHEN 'Sử' THEN s.history_score

                WHEN 'Địa' THEN s.geography_score

                WHEN 'GDCD' THEN s.civic_education_score

                WHEN 'Tin' THEN s.cs_score

                WHEN 'CNCN' THEN s.itech_score

                WHEN 'CNNN' THEN s.atech_score

                WHEN 'Ngoại ngữ' THEN s.foreign_language_score

                ELSE NULL

            END), 2) AS avg_score_teacher,

            MAX(CASE t.subject

                WHEN 'Toán' THEN s.math_score

                WHEN 'Văn' THEN s.literature_score

                WHEN 'Lý' THEN s.physics_score

                WHEN 'Hóa' THEN s.chemistry_score

                WHEN 'Sinh' THEN s.biology_score

                WHEN 'Sử' THEN s.history_score

                WHEN 'Địa' THEN s.geography_score

                WHEN 'GDCD' THEN s.civic_education_score

                WHEN 'Tin' THEN s.cs_score

                WHEN 'CNCN' THEN s.itech_score

                WHEN 'CNNN' THEN s.atech_score

                WHEN 'Ngoại ngữ' THEN s.foreign_language_score

                ELSE NULL                

            END) AS max_score_teacher,

            MIN(CASE t.subject

                WHEN 'Toán' THEN s.math_score

                WHEN 'Văn' THEN s.literature_score

                WHEN 'Lý' THEN s.physics_score

                WHEN 'Hóa' THEN s.chemistry_score

                WHEN 'Sinh' THEN s.biology_score

                WHEN 'Sử' THEN s.history_score

                WHEN 'Địa' THEN s.geography_score

                WHEN 'GDCD' THEN s.civic_education_score

                WHEN 'Tin' THEN s.cs_score

                WHEN 'CNCN' THEN s.itech_score

                WHEN 'CNNN' THEN s.atech_score

                WHEN 'Ngoại ngữ' THEN s.foreign_language_score

                ELSE NULL

            END) AS min_score_teacher

        FROM students s

        JOIN teachers t

            ON s.class_name = t.class_name AND s.site = t.site

        WHERE t.year = in_year AND t.site = in_site

        GROUP BY t.subject, t.name

    ) t

    ON c.subject = t.subject AND c.teacher_name = t.teacher_name;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_ZERO_IN_DATE,NO_ZERO_DATE,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_top_student_exam_scores` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_top_student_exam_scores`(

    IN in_site VARCHAR(50),

    IN in_top INT

)
BEGIN

    SELECT

        student_id, student_name, cmnd, class_name,

        site, block_code, subject1, subject2, subject3,

        score1, score2, score3, total_score, rank_in_block 

    FROM (

        SELECT

            s.id AS student_id, s.name AS student_name, s.cmnd, s.class_name,				

            s.site, eb.block_code, eb.subject1, eb.subject2, eb.subject3,                     

            CASE eb.subject1 WHEN 'Toán' THEN s.math_score

                WHEN 'Văn' THEN s.literature_score

                WHEN 'Lý' THEN s.physics_score

                WHEN 'Hóa' THEN s.chemistry_score

                WHEN 'Sinh' THEN s.biology_score

                WHEN 'Sử' THEN s.history_score

                WHEN 'Địa' THEN s.geography_score

                WHEN 'GDCD' THEN s.civic_education_score

                WHEN 'Tin' THEN s.cs_score

                WHEN 'CNCN' THEN s.itech_score

                WHEN 'CNNN' THEN s.atech_score

                WHEN 'Ngoại ngữ' THEN s.foreign_language_score

            END AS score1,

            CASE eb.subject2 WHEN 'Toán' THEN s.math_score

                WHEN 'Văn' THEN s.literature_score

                WHEN 'Lý' THEN s.physics_score

                WHEN 'Hóa' THEN s.chemistry_score

                WHEN 'Sinh' THEN s.biology_score

                WHEN 'Sử' THEN s.history_score

                WHEN 'Địa' THEN s.geography_score

                WHEN 'GDCD' THEN s.civic_education_score

                WHEN 'Tin' THEN s.cs_score

                WHEN 'CNCN' THEN s.itech_score

                WHEN 'CNNN' THEN s.atech_score

                WHEN 'Ngoại ngữ' THEN s.foreign_language_score

            END AS score2,

            CASE eb.subject3 WHEN 'Toán' THEN s.math_score

                WHEN 'Văn' THEN s.literature_score

                WHEN 'Lý' THEN s.physics_score

                WHEN 'Hóa' THEN s.chemistry_score

                WHEN 'Sinh' THEN s.biology_score

                WHEN 'Sử' THEN s.history_score

                WHEN 'Địa' THEN s.geography_score

                WHEN 'GDCD' THEN s.civic_education_score

                WHEN 'Tin' THEN s.cs_score

                WHEN 'CNCN' THEN s.itech_score

                WHEN 'CNNN' THEN s.atech_score

                WHEN 'Ngoại ngữ' THEN s.foreign_language_score

            END AS score3,

            -- Tổng điểm

            (

                CASE eb.subject1 WHEN 'Toán' THEN s.math_score WHEN 'Văn' THEN s.literature_score

                    WHEN 'Lý' THEN s.physics_score WHEN 'Hóa' THEN s.chemistry_score

                    WHEN 'Sinh' THEN s.biology_score WHEN 'Sử' THEN s.history_score

                    WHEN 'Địa' THEN s.geography_score WHEN 'GDCD' THEN s.civic_education_score

                    WHEN 'Tin' THEN s.cs_score WHEN 'CNCN' THEN s.itech_score WHEN 'CNNN' THEN s.atech_score

                    WHEN 'Ngoại ngữ' THEN s.foreign_language_score ELSE 0 END

                +

                CASE eb.subject2 WHEN 'Toán' THEN s.math_score WHEN 'Văn' THEN s.literature_score

                    WHEN 'Lý' THEN s.physics_score WHEN 'Hóa' THEN s.chemistry_score

                    WHEN 'Sinh' THEN s.biology_score WHEN 'Sử' THEN s.history_score

                    WHEN 'Địa' THEN s.geography_score WHEN 'GDCD' THEN s.civic_education_score

                    WHEN 'Tin' THEN s.cs_score WHEN 'CNCN' THEN s.itech_score WHEN 'CNNN' THEN s.atech_score

                    WHEN 'Ngoại ngữ' THEN s.foreign_language_score ELSE 0 END

                +

                CASE eb.subject3 WHEN 'Toán' THEN s.math_score WHEN 'Văn' THEN s.literature_score

                    WHEN 'Lý' THEN s.physics_score WHEN 'Hóa' THEN s.chemistry_score

                    WHEN 'Sinh' THEN s.biology_score WHEN 'Sử' THEN s.history_score

                    WHEN 'Địa' THEN s.geography_score WHEN 'GDCD' THEN s.civic_education_score

                    WHEN 'Tin' THEN s.cs_score WHEN 'CNCN' THEN s.itech_score WHEN 'CNNN' THEN s.atech_score

                    WHEN 'Ngoại ngữ' THEN s.foreign_language_score ELSE 0 END                

            ) AS total_score,

            ROW_NUMBER() OVER (

                PARTITION BY eb.block_code

                ORDER BY (

                CASE eb.subject1 WHEN 'Toán' THEN s.math_score WHEN 'Văn' THEN s.literature_score

                    WHEN 'Lý' THEN s.physics_score WHEN 'Hóa' THEN s.chemistry_score

                    WHEN 'Sinh' THEN s.biology_score WHEN 'Sử' THEN s.history_score

                    WHEN 'Địa' THEN s.geography_score WHEN 'GDCD' THEN s.civic_education_score

                    WHEN 'Tin' THEN s.cs_score WHEN 'CNCN' THEN s.itech_score WHEN 'CNNN' THEN s.atech_score

                    WHEN 'Ngoại ngữ' THEN s.foreign_language_score ELSE 0 END

                +

                CASE eb.subject2 WHEN 'Toán' THEN s.math_score WHEN 'Văn' THEN s.literature_score

                    WHEN 'Lý' THEN s.physics_score WHEN 'Hóa' THEN s.chemistry_score

                    WHEN 'Sinh' THEN s.biology_score WHEN 'Sử' THEN s.history_score

                    WHEN 'Địa' THEN s.geography_score WHEN 'GDCD' THEN s.civic_education_score

                    WHEN 'Tin' THEN s.cs_score WHEN 'CNCN' THEN s.itech_score WHEN 'CNNN' THEN s.atech_score

                    WHEN 'Ngoại ngữ' THEN s.foreign_language_score ELSE 0 END

                +

                CASE eb.subject3 WHEN 'Toán' THEN s.math_score WHEN 'Văn' THEN s.literature_score

                    WHEN 'Lý' THEN s.physics_score WHEN 'Hóa' THEN s.chemistry_score

                    WHEN 'Sinh' THEN s.biology_score WHEN 'Sử' THEN s.history_score

                    WHEN 'Địa' THEN s.geography_score WHEN 'GDCD' THEN s.civic_education_score

                    WHEN 'Tin' THEN s.cs_score WHEN 'CNCN' THEN s.itech_score WHEN 'CNNN' THEN s.atech_score

                    WHEN 'Ngoại ngữ' THEN s.foreign_language_score ELSE 0 END

                ) DESC

            ) AS rank_in_block

        FROM students s

        CROSS JOIN ExamBlock eb

        WHERE s.site = in_site

          AND CASE eb.subject1 WHEN 'Toán' THEN s.math_score WHEN 'Văn' THEN s.literature_score

              WHEN 'Lý' THEN s.physics_score WHEN 'Hóa' THEN s.chemistry_score

              WHEN 'Sinh' THEN s.biology_score WHEN 'Sử' THEN s.history_score

              WHEN 'Địa' THEN s.geography_score WHEN 'GDCD' THEN s.civic_education_score

              WHEN 'Tin' THEN s.cs_score WHEN 'CNCN' THEN s.itech_score WHEN 'CNNN' THEN s.atech_score 

              WHEN 'Ngoại ngữ' THEN s.foreign_language_score END IS NOT NULL

          AND CASE eb.subject2 WHEN 'Toán' THEN s.math_score WHEN 'Văn' THEN s.literature_score

              WHEN 'Lý' THEN s.physics_score WHEN 'Hóa' THEN s.chemistry_score

              WHEN 'Sinh' THEN s.biology_score WHEN 'Sử' THEN s.history_score

              WHEN 'Địa' THEN s.geography_score WHEN 'GDCD' THEN s.civic_education_score

              WHEN 'Tin' THEN s.cs_score WHEN 'CNCN' THEN s.itech_score WHEN 'CNNN' THEN s.atech_score 

              WHEN 'Ngoại ngữ' THEN s.foreign_language_score END IS NOT NULL

          AND CASE eb.subject1 WHEN 'Toán' THEN s.math_score WHEN 'Văn' THEN s.literature_score

              WHEN 'Lý' THEN s.physics_score WHEN 'Hóa' THEN s.chemistry_score

              WHEN 'Sinh' THEN s.biology_score WHEN 'Sử' THEN s.history_score

              WHEN 'Địa' THEN s.geography_score WHEN 'GDCD' THEN s.civic_education_score

              WHEN 'Tin' THEN s.cs_score WHEN 'CNCN' THEN s.itech_score WHEN 'CNNN' THEN s.atech_score 

              WHEN 'Ngoại ngữ' THEN s.foreign_language_score END IS NOT NULL

    ) AS ranked_scores

    WHERE rank_in_block <= in_top;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-17 14:25:55
