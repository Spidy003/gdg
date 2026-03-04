from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from fastapi import UploadFile
from sqlalchemy import select
from core.final_score import add_score

load_dotenv()
from models.round_2 import Round_2
from models.leaderboard import Leaderboard 


async def admin_round_2_service(
    db: AsyncSession,
    Team_Name: str,
    status: str,
    score_2: int,
    feedback_2: str):
    result = await db.execute(select(Round_2).where(Round_2.Team_Name == Team_Name))
    res = await db.execute(select(Leaderboard).where(Leaderboard.Team_Name == Team_Name))
    res_leaderboard = res.scalar_one_or_none()
    event = result.scalar_one_or_none()

    if event:
        await add_score(db, Team_Name, score_2)
        res_leaderboard.status_2 = status
        event.status = status
        event.score_2 = score_2
        event.feedback_2 = feedback_2
        await db.commit()
        await db.refresh(event)
        await db.refresh(res_leaderboard)

    return event

async def get_all_round_2(db: AsyncSession) -> List[Round_2]:
    result = await db.execute(select(Round_2.Team_Name))
    events = result.scalars().all()
    return {"Teams": events}

async def get_round_2_by_team_name(db: AsyncSession, Team_Name: str) -> Round_2:
    result = await db.execute(select(Round_2).where(Round_2.Team_Name == Team_Name))
    event = result.scalar_one_or_none()
    return event