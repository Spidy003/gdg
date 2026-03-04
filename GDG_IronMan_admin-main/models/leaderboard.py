from sqlalchemy import Column, Integer, Text
from sqlalchemy.dialects.postgresql import JSONB
from core.dependency import Base

class Leaderboard(Base):
    __tablename__ = "leaderboard"

    Team_Name = Column(Text, primary_key=True, index=True)

    team_score = Column(Integer, nullable=True)

    status_1 = Column(Text,nullable=True)
    status_2 = Column(Text,nullable=True)
    status_3 = Column(Text,nullable=True)
    status_4 = Column(Text,nullable=True)

    
    