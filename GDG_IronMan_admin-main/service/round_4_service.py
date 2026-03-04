import select
from sqlalchemy import select

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession 
from typing import List
from core.final_score import add_score



load_dotenv()
from models.round_4 import  Round_4
from models.leaderboard import Leaderboard


async def submit_round_4_service(
    db: AsyncSession,
    Team_Name: str,
    score_4: int,
    feedback_4: str,
):   
    

    result = await db.execute(select(Round_4).where(Round_4.Team_Name == Team_Name))
    event = result.scalar_one_or_none()

    if event:
        await add_score(db, Team_Name, score_4)
        event.score_4 = score_4
        event.feedback_4 = feedback_4
        await db.commit()
        await db.refresh(event)
    
    return event

async def get_all_round_4(db: AsyncSession) -> List[Round_4]:
    result = await db.execute(select(Round_4.Team_Name))
    events = result.scalars().all()
    return {"Teams":events}

async def get_round_4_by_team_name(db: AsyncSession, Team_Name: str) -> Round_4:
    result = await db.execute(select(Round_4).where(Round_4.Team_Name == Team_Name))
    event = result.scalar_one_or_none()
    return event

async def submit_status_round_4_service(
    db: AsyncSession,
    Team_Name: str,
    status_4: str,
):
    result = await db.execute(select(Round_4).where(Round_4.Team_Name == Team_Name))
    event = result.scalar_one_or_none()

    if event:
        event.status_4 = status_4
        await db.commit()
        await db.refresh(event)
    return event


async def eligible_for_round_5_service(db: AsyncSession) -> bool:
    result = await db.execute(select(Round_4).where(Round_4.status_4 == "Approved"))
    round_4_entries = result.scalars().all()

    return round_4_entries