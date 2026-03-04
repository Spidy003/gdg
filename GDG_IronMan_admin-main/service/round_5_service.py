
import select
from typing import List
from sqlalchemy import select

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from core.final_score import add_score


load_dotenv()
from models.round_5 import Round_5
from models.leaderboard import Leaderboard




async def Admin_round_5_service(
    db: AsyncSession,
    Team_Name: str,
    
    score_5: int,
    
):
    result = await db.execute(select(Round_5).where(Round_5.Team_Name == Team_Name))
    event = result.scalar_one_or_none()
    res = await db.execute(select(Leaderboard).where(Leaderboard.Team_Name == Team_Name))
   

    if event:
        await add_score(db, Team_Name, score_5)
        event.score_5 = score_5

        
        await db.commit()
        await db.refresh(event)

    return event

async def get_all_round_5(db: AsyncSession) -> List[Round_5]:
    result = await db.execute(select(Round_5.Team_Name))
    events = result.scalars().all()
    return {"Teams":events}

async def get_round_5_by_team_name(db: AsyncSession, Team_Name: str) -> Round_5:
    result = await db.execute(select(Round_5).where(Round_5.Team_Name == Team_Name))
    event = result.scalar_one_or_none()
    return event