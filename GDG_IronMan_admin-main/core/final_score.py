from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
from models.leaderboard import Leaderboard

async def add_score(db: AsyncSession, Team_Name: str, score_to_add: int, ):

    result = await db.execute(
        select(Leaderboard).where(Leaderboard.Team_Name == Team_Name)
    )

    round_obj = result.scalar_one_or_none()

    if not round_obj:
        raise HTTPException(404, "Record not found")

    round_obj.team_score += score_to_add

    await db.commit()
    await db.refresh(round_obj)

    return round_obj
