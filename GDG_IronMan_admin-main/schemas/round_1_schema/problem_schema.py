from pydantic import BaseModel
from typing import List, Dict, Any


class TestCase(BaseModel):
    input: str
    hidden: bool
    output: str

class Pre_Code(BaseModel):
    java: str
    c: str
    cpp: str
    python: str
    javascript: str

class Post_Code(BaseModel):
    java: str
    c: str
    cpp: str
    python: str
    javascript: str



class ProblemCreate(BaseModel):
    contest_id: str
    title: str
    description: str
    test_cases: List[TestCase]
    score: int
    post_code: List[Post_Code]
    pre_code: List[Pre_Code]