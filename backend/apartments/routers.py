from io import BytesIO

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

import pandas as pd
from starlette.responses import JSONResponse

from apartments.managers import ApartmentManager
from apartments.models import Apartment
from apartments.schemas import AddApartmentResponse, AddApartmentBody, UpdateApartmentBody, BulkCreateApartmentsBody
from apartments.validations import ApartmentValidator
from auth.dependencies import has_permission
from coefficients.models import BuildingCoefficientType
from core.db.session import get_db


router = APIRouter(prefix="/apartments", tags=["Apartments"])

"-------------------------------------------------------------------------------------------"

@router.get(
    "/",
    response_model=list[AddApartmentResponse],
    dependencies=[Depends(has_permission("view_apartments"))]
)
async def get_apartment_list(db: AsyncSession = Depends(get_db)):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.get_apartment_list()

"-------------------------------------------------------------------------------------------"

@router.post(
    "/add/",
    response_model=AddApartmentResponse,
    dependencies=[Depends(has_permission("create_apartments"))]
)
async def add_apartment(create_apartment: AddApartmentBody, db: AsyncSession = Depends(get_db)):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.create_apartment(**create_apartment.model_dump())

"-------------------------------------------------------------------------------------------"

@router.get(
    "/{apartment_id}/",
    response_model=AddApartmentResponse,
    dependencies=[Depends(has_permission("view_apartments"))]
)
async def get_apartment(apartment_id: int, db: AsyncSession = Depends(get_db)):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.get_apartment(apartment_id)

"-------------------------------------------------------------------------------------------"

@router.patch(
    "/{apartment_id}/",
    response_model=AddApartmentResponse,
    dependencies=[Depends(has_permission("update_apartments"))]
)
async def edit_apartment(apartment_id: int, update_apartment: UpdateApartmentBody, db: AsyncSession = Depends(get_db)):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.update_apartment(apartment_id, **update_apartment.model_dump())

"-------------------------------------------------------------------------------------------"

@router.delete(
    "/{apartment_id}/",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(has_permission("delete_apartments"))]
)
async def delete_apartment(apartment_id: int, db: AsyncSession = Depends(get_db)):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.delete_apartment(apartment_id)


@router.post("/bulk-create/{building_id}")
async def bulk_create_apartments(building_id: int, excel_file: UploadFile, db: AsyncSession = Depends(get_db)):
    apartment_validator = ApartmentValidator(db)


    content = await excel_file.read()
    df = pd.read_excel(BytesIO(content))

    # print(type(df))
    # print(df)
    #
    # print("--------------------------------------------\n")
    # print(f"COLUMNS \n{df.columns}")
    # print(f"index values: {df.columns.values.tolist()}")
    #
    # print("--------------------------------------------\n")
    # print("ROWS")
    # print(f"row labels: {df.index.tolist()}")
    #
    # print("--------------------------------------------\n")
    # print("ITER ROWS")

    column_names = df.columns.values.tolist()

    await apartment_validator.http_validate_bulk_create(
        building_id=building_id,
        column_names=column_names
    )

    errors = []
    for _, row in df.iterrows():
        new_apartment = Apartment(
            building_id=building_id,
            number=str(row["number"]),
            floor=int(row["floor"]),
            area=row["area"],
            room_count=int(row["room_count"]),
        )

        db.add(new_apartment)
        await db.flush()

        for bc_name in column_names[4:]:
            result = await db.execute(select(BuildingCoefficientType).where(BuildingCoefficientType.name == row[bc_name]))
            bct_obj = result.scalar_one_or_none()

            if bct_obj:
                new_apartment.building_coefficient_types.append(bct_obj)
            else:
                errors.append(f"{_ + 2} - qatorda xatolik")


        await db.commit()


    if errors:
        return errors
    return JSONResponse(status_code=status.HTTP_200_OK, content={"detail": "success"})





