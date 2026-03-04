from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.round_1.contests import Contest
from datetime import date, datetime
from sqlalchemy.ext.asyncio import AsyncSession

async def create_contest(
    db: AsyncSession,
    contest_id: str,
    description: str,
    start_time: datetime,
    end_time: datetime
):
    # Check if contest exists
    result = await db.execute(
        select(Contest).where(Contest.contest_id == contest_id)
    )
    existing_contest = result.scalar_one_or_none()

    if existing_contest:
        raise ValueError("Contest already exists")

    # Create contest
    new_contest = Contest(
        contest_id=contest_id,
        description=description,
        start_time=start_time,
        end_time=end_time,
        created_at=date.today()
    )

    db.add(new_contest)

    await db.commit()
    await db.refresh(new_contest)

    return {"message": "Contest created", "contest_id": new_contest.contest_id}

async def get_contest_by_id(db: AsyncSession, contest_id: str):
    result = await db.execute(
        select(Contest).where(Contest.contest_id == contest_id)
    )
    contest = result.scalar_one_or_none()
    if not contest:
        raise ValueError("Contest not found")
    return contest

async def enter_contest(contest_id: str, team_name: str, db: AsyncSession):
    contest = await get_contest_by_id(db, contest_id)
    if not contest:
        raise ValueError("Contest not found")
    return {"message": f"Team {team_name} entered contest {contest_id}"}


