from pydantic import BaseModel

class Admin_4_Status(BaseModel):
    Team_Name: str
    status_4: str
    
    
class Admin_4_Submit(BaseModel):
    Team_Name: str
    score_4: int
    feedback_4: str
    
# Team_Name TEXT
# status_4 TEXT
# score_4 INTEGER
# feedback_4 TEXT