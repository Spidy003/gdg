from sqlalchemy.orm import  mapped_column
from sqlalchemy import Text
from sqlalchemy.dialects.postgresql import JSONB
from core.dependency import Base


class Registration(Base):
    __tablename__ = "registration"

    Team_Name = mapped_column(Text, primary_key=True)
    team_members = mapped_column(JSONB)
