from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

load_dotenv()
from models.leaderboard import Leaderboard


async def admin_round_2_service(
    db: AsyncSession,
    Team_Name: str
    ):
    result = await db.execute(select(Leaderboard).where(Leaderboard.Team_Name == Team_Name))
    event = result.scalar_one_or_none()

    return event
