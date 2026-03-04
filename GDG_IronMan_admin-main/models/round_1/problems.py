from sqlalchemy import Column, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB
from core.dependency import Base

class Problem(Base):
    __tablename__ = "problems"

    problem_id = Column(Integer, primary_key=True, index=True)

    contest_id = Column(Text, nullable=False, index=True)

    title = Column(Text, nullable=True)

    description = Column(Text, nullable=True)

    test_cases = Column(JSONB, nullable=True)

    score = Column(Integer, nullable=True)
    post_code = Column(JSONB, nullable=True)
    pre_code = Column(JSONB, nullable=True)
    
    