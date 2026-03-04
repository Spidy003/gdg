from pydantic import BaseModel
from datetime import datetime

class ContestCreate(BaseModel):
    contest_id: str
    description: str
    start_time: datetime   
    end_time: datetime
