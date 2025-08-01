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
END;
