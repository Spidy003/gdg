from sqlalchemy import Column, Text, TIMESTAMP, Date
from core.dependency import Base


class Contest(Base):
    __tablename__ = "contests"

    contest_id = Column(Text, primary_key=True, index=True) # Team_Nmae

    description = Column(Text, nullable=True)

    start_time = Column(TIMESTAMP, nullable=True)

    end_time = Column(TIMESTAMP, nullable=True)

    created_at = Column(Date, nullable=True)

    
# __tablename__ = "round5"

