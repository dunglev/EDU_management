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
-- Dump completed on 2025-06-25 14:55:37
