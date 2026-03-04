from pydantic import BaseModel
from datetime import datetime

class admin_2_submit(BaseModel):
    Team_Name: str
    status: str
    score_2:int
    feedback_2:str
    

#  Team_Name TEXT
# git_hub_link TEXT
# hosted_link TEXT
# ss_links TEXT
# status TEXT
# score_2 INTEGER
# feedback_2 TEXT