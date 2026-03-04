from typing import List

from sqlalchemy import select

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from core.final_score import add_score

load_dotenv()
from models.round_3 import Round_3
from models.leaderboard import Leaderboard


async def admin_round_3_service(
    db: AsyncSession,
    Team_Name: str,
    status_3: str ,
    feedback_3: str,
    score_3: int,
):


    result = await db.execute(select(Round_3).where(Round_3.Team_Name == Team_Name))
    res = await db.execute(select(Leaderboard).where(Leaderboard.Team_Name == Team_Name))
    res_leaderboard = res.scalar_one_or_none()
    event = result.scalar_one_or_none()

    if event:
        await add_score(db, Team_Name, score_3)
        res_leaderboard.status_3 = status_3
        event.status_3 = status_3
        event.score_3 = score_3
        event.feedback_3 = feedback_3
        await db.commit()
        await db.refresh(event)
        await db.refresh(res_leaderboard)

    return event

async def get_all_round_3(db: AsyncSession) -> List[Round_3]:
    result = await db.execute(select(Round_3.Team_Name))
    events = result.scalars().all()
    return {"Teams":events}

async def get_round_3_by_team_name(db: AsyncSession, Team_Name: str) -> Round_3:
    result = await db.execute(select(Round_3).where(Round_3.Team_Name == Team_Name))
    event = result.scalar_one_or_none()
    return event