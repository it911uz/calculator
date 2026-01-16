from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from comlexes.repositories import ComplexRepository
from comlexes.schemas import AddComplexResponse, AddComplexBody, UpdateComplexBody
from core.dependencies import get_db

router = APIRouter(prefix="/complexes", tags=["Complexes"])


@router.get("/", response_model=list[AddComplexResponse])
async def get_complex_list(db: AsyncSession = Depends(get_db)):
    complex_repo = ComplexRepository(db)
    return await complex_repo.get_complex_list()


@router.post("/add/", response_model=AddComplexResponse)
async def add_complex(create_complex: AddComplexBody, db: AsyncSession = Depends(get_db)):
    complex_repo = ComplexRepository(db)
    return await complex_repo.create_complex(**create_complex.model_dump())


@router.get("/{complex_id}/", response_model=AddComplexResponse)
async def get_complex(complex_id: int, db: AsyncSession = Depends(get_db)):
    complex_repo = ComplexRepository(db)
    return await complex_repo.get_complex(complex_id)


@router.put("/{complex_id}/", response_model=AddComplexResponse)
async def edit_complex(complex_id: int, update_complex: UpdateComplexBody, db: AsyncSession = Depends(get_db)):
    complex_repo = ComplexRepository(db)
    return await complex_repo.update_complex(complex_id, **update_complex.model_dump(exclude_unset=True))


@router.delete("/{complex_id}/")
async def delete_complex(complex_id: int, db: AsyncSession = Depends(get_db)):
    complex_repo = ComplexRepository(db)
    return await complex_repo.delete_complex(complex_id)





