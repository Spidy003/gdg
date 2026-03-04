from pydantic import BaseModel

class Admin_5_Submit(BaseModel):
    Team_Name: str
   
    score_5: int   
    
# Team_Name TEXT
# score_5 INTEGER