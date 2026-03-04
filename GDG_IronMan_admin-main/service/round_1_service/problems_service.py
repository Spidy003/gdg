from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.round_1.problems import Problem


async def create_problem(
    db: AsyncSession,
    contest_id: str,
    title: str,
    description: str,
    test_cases: dict,
    score: int,
    pre_code: str,
    post_code: dict
):
    # Optional: check if contest exists
    # (recommended if foreign key exists)

    # Create problem object
    new_problem = Problem(
        contest_id=contest_id,
        title=title,
        description=description,
        test_cases=test_cases,
        score=score,
        pre_code=pre_code,
        post_code=post_code
    )

    # Save to DB
    db.add(new_problem)

    await db.commit()
    await db.refresh(new_problem)

    return new_problem

async def get_problem_by_id(db: AsyncSession, problem_id: int):
    result = await db.execute(
        select(Problem).where(Problem.problem_id == problem_id)
    )
    problem = result.scalar_one_or_none()
    if not problem:
        raise ValueError("Problem not found")
    return problem

async def get_problems_by_contest_id(db: AsyncSession, contest_id: str):
    result = await db.execute(
        select(Problem).where(Problem.contest_id == contest_id)
    )
    problems = result.scalars().all()
    return problems

async def get_pre_code_by_problem_id(db: AsyncSession, problem_id: int):
    problem = await get_problem_by_id(db, problem_id)
    return problem.pre_code

async def get_post_code_by_problem_id(db: AsyncSession, problem_id: int):
    problem = await get_problem_by_id(db, problem_id)
    return problem.post_code