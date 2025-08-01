from sqlalchemy import Table, Column, Integer, String, Float
from config.metadata import metadata

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("username", String(50), unique=True, nullable=False),
    Column("password", String(255), nullable=False),
    Column("role", String(20), nullable=False, default="user"),
    Column("site", String(50), nullable=False),
)

students = Table(
    "students",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100), nullable=False),
    Column("class_name", String(20), nullable=False),
    Column("cmnd", String(12), unique=True, nullable=False),
    Column("gender", String(10)),
    Column("dob", String(10)),
    Column("birth_place", String(100)),
    Column("ethnicity", String(50)),
    Column("math_score", Float),
    Column("literature_score", Float),
    Column("physics_score", Float),
    Column("chemistry_score", Float),
    Column("biology_score", Float),
    Column("history_score", Float),
    Column("geography_score", Float),
    Column("civic_education_score", Float),
    Column("cs_score", Float),
    Column("itech_score", Float),
    Column("atech_score", Float),
    Column("foreign_language_score", Float),    
    Column("foreign_language", String(10)),
    Column("site", String(50)),    
    Column("council_code", String(20))
)

teachers = Table(
    "teachers",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100), nullable=False),
    Column("subject", String(50), nullable=False),
    Column("class_name", String(20), nullable=False),
    Column("year", String(4), nullable=False),
    Column("site", String(50), default="Cơ sở 1")
)

ScoreAvg = Table(
    "ScoreAvg",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(10), nullable=False),
    Column("year", String(4), nullable=False),
    Column("math_score", Float),
    Column("literature_score", Float),
    Column("physics_score", Float),
    Column("chemistry_score", Float),
    Column("biology_score", Float),
    Column("history_score", Float),
    Column("geography_score", Float),
    Column("civic_education_score", Float),
    Column("cs_score", Float),
    Column("itech_score", Float),
    Column("atech_score", Float), 
    Column("foreign_language_score", Float),       
    Column("foreign_language", String(10))
)

ExamBlock = Table(
    "ExamBlock",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("block_code", String(3), nullable=False),
    Column("subject1", String(20), nullable=False),
    Column("subject2", String(20), nullable=False),
    Column("subject3", String(20), nullable=False),
    Column("field_study", String(60), nullable=False)
)
