from pydantic import BaseModel
from datetime import datetime

class admin_3_submit(BaseModel):
    Team_Name: str
    status_3: str
    feedback_3:str
    score_3:int
    

#     Team_Name TEXT
# status_3 TEXT
# feedback_3 TEXT
# score_3 INTEGER