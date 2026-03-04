
from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from core.db import get_db
from models.round_1.problems import Problem
from schemas.round_1_schema.problem_schema import ProblemCreate
from service.round_2_service import admin_round_2_service, get_all_round_2, get_round_2_by_team_name
from schemas.round_2_schema import admin_2_submit
from service.round_3_service import admin_round_3_service, get_all_round_3, get_round_3_by_team_name
from schemas.round_3_schema import admin_3_submit
from schemas.round_4_schema import Admin_4_Submit,Admin_4_Status
from service.round_4_service import eligible_for_round_5_service, get_all_round_4, get_round_4_by_team_name, submit_round_4_service, submit_status_round_4_service
from service.round_5_service import Admin_round_5_service, get_all_round_5, get_round_5_by_team_name
from schemas.round_5_schema import Admin_5_Submit
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/judge_round_2")
async def judge_round_2_endpoint(
    round_2: admin_2_submit,
    db: AsyncSession = Depends(get_db)
):

    event = await admin_round_2_service(
        db=db,
        Team_Name=round_2.Team_Name,
        status=round_2.status,
        score_2=round_2.score_2,
        feedback_2=round_2.feedback_2
    )

    return {
        "message": "Judged successfully",
        "event": event
    }

@app.post("/judge_round_3")
async def judge_round_3_endpoint(  
    round_3: admin_3_submit,
    db: AsyncSession = Depends(get_db)
):
    
    event = await admin_round_3_service(
        db=db,
        Team_Name=round_3.Team_Name,
        status_3=round_3.status_3,
        feedback_3=round_3.feedback_3,
        score_3=round_3.score_3
    )

    return {
        "message": "Judged successfully",
        "event": event
    }

@app.post("/judge_round_4")
async def submit_round_4(result: Admin_4_Submit, db: AsyncSession = Depends(get_db)):
    return await submit_round_4_service(
        db=db,
        Team_Name=result.Team_Name,
        score_4=result.score_4,
        feedback_4=result.feedback_4
    )
@app.post("/judge_round_5")
async def submit_round_5(result: Admin_5_Submit, db: AsyncSession = Depends(get_db)):
    return await Admin_round_5_service(
        db=db,
        Team_Name=result.Team_Name,

        score_5=result.score_5,
       
    )
    
@app.post("/problem")
async def api_create_problem(
    problem: ProblemCreate,
    db: AsyncSession = Depends(get_db)
):
    new_problem = Problem(
        contest_id=problem.contest_id,
        title=problem.title,
        description=problem.description,
        test_cases=[tc.dict() for tc in problem.test_cases],
        score=problem.score,
        post_code=[poc.dict() for poc in problem.post_code],
        pre_code=[prc.dict() for prc in problem.pre_code]
    )

    db.add(new_problem)

    await db.commit()
    await db.refresh(new_problem)

    return {
        "message": "Problem created successfully",
        "problem_id": new_problem.problem_id
    }

@app.get("/round_2_submissions")
async def get_all_round_2_submissions(db: AsyncSession = Depends(get_db)):
    return await get_all_round_2(db)

@app.get("/round_3_submissions")
async def get_all_round_3_submissions(db: AsyncSession = Depends(get_db)):
    return await get_all_round_3(db)

@app.get("/round_4_submissions")
async def get_all_round_4_submissions(db: AsyncSession = Depends(get_db)):
    return await get_all_round_4(db)

@app.get("/round_5_submissions")
async def get_all_round_5_submissions(db: AsyncSession = Depends(get_db)):
    return await get_all_round_5(db)

@app.get("/round_2_submissions/{team_name}")
async def get_round_2_submission_by_team_name(team_name: str, db: AsyncSession = Depends(get_db)):
    return await get_round_2_by_team_name(db, team_name)

@app.get("/round_3_submissions/{team_name}")
async def get_round_3_submission_by_team_name(team_name: str, db: AsyncSession = Depends(get_db)):
    return await get_round_3_by_team_name(db, team_name)

@app.get("/round_4_submissions/{team_name}")
async def get_round_4_submission_by_team_name(team_name: str, db: AsyncSession = Depends(get_db)):
    return await get_round_4_by_team_name(db, team_name)

@app.get("/round_5_submissions/{team_name}")
async def get_round_5_submission_by_team_name(team_name: str, db: AsyncSession = Depends(get_db)):
    return await get_round_5_by_team_name(db, team_name)

@app.get("/eligible_for_round_5")
async def check_eligibility_for_round_5(db: AsyncSession = Depends(get_db)):
    eligible_teams = await eligible_for_round_5_service(db)
    return {
        "eligible_teams": eligible_teams
    }


@app.post("/submit_status_round_4")
async def submit_status_round_4(result: Admin_4_Status, db: AsyncSession = Depends(get_db)):
    return await submit_status_round_4_service(
        db=db,
        Team_Name=result.Team_Name,
        status_4=result.status_4
    )