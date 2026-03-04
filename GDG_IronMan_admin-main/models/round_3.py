from sqlalchemy import Column, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB
from core.dependency import Base

class Round_3(Base):
    __tablename__ = "round_3"

    Team_Name = Column(Text, primary_key=True, index=True)

    figma_links = Column(Text, nullable=False, index=True)

    ss_links_round_3 = Column(Text, nullable=True)

    description = Column(Text, nullable=True)
    
    status_3 = Column(Text, nullable=True)

    feedback_3 = Column(Text, nullable=True)
    score_3 = Column(Integer, nullable=True)
    question = Column(Text, nullable=True)

#     Team_Name TEXT
# status_3 TEXT
# feedback_3 TEXT
# score_3 INTEGER