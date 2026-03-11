from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from auth.dependencies import has_permission
from complexes.filters import ComplexFilter
from complexes.repositories import ComplexRepository
from complexes.schemas import AddComplexResponse, AddComplexBody, UpdateComplexBody
from core.db.session import get_db

router = APIRouter(prefix="/complexes", tags=["Complexes"])

"-------------------------------------------------------------------------------------------"

@router.get(
    "/",
    response_model=list[AddComplexResponse],
    dependencies=[Depends(has_permission("view_complexes"))]
)
async def get_complex_list(
        db: AsyncSession = Depends(get_db),
        filters: ComplexFilter = Depends(),
):
    complex_repo = ComplexRepository(db)
    return await complex_repo.get_complex_list(filters)

"-------------------------------------------------------------------------------------------"

@router.post(
    "/add/",
    response_model=AddComplexResponse,
    dependencies=[Depends(has_permission("create_complexes"))]
)
async def add_complex(create_complex: AddComplexBody, db: AsyncSession = Depends(get_db)):
    complex_repo = ComplexRepository(db)
    return await complex_repo.create_complex(**create_complex.model_dump())

"-------------------------------------------------------------------------------------------"

@router.get(
    "/{complex_id}/",
    response_model=AddComplexResponse,
    dependencies=[Depends(has_permission("view_complexes"))]
)
async def get_complex(complex_id: int, db: AsyncSession = Depends(get_db)):
    complex_repo = ComplexRepository(db)
    return await complex_repo.get_complex(complex_id)

"-------------------------------------------------------------------------------------------"

@router.patch(
    "/{complex_id}/",
    response_model=AddComplexResponse,
    dependencies=[Depends(has_permission("update_complexes"))]
)
async def edit_complex(complex_id: int, update_complex: UpdateComplexBody, db: AsyncSession = Depends(get_db)):
    complex_repo = ComplexRepository(db)
    return await complex_repo.update_complex(complex_id, **update_complex.model_dump(exclude_unset=True))

"-------------------------------------------------------------------------------------------"

@router.delete(
    "/{complex_id}/",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(has_permission("delete_complexes"))]
)
async def delete_complex(complex_id: int, db: AsyncSession = Depends(get_db)):
    complex_repo = ComplexRepository(db)
    return await complex_repo.delete_complex(complex_id)





