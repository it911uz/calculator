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
from apartments.services import recalculate_final_price
from apartments.validations import ApartmentBulkCreateValidator
from auth.dependencies import has_permission
from coefficients.models import BuildingCoefficientType, BuildingCoefficient
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


@router.post("/bulk-create/{building_id}", dependencies=[Depends(has_permission("create_apartments"))])
async def bulk_create_apartments(building_id: int, excel_file: UploadFile, db: AsyncSession = Depends(get_db)):
    apartment_validator = ApartmentBulkCreateValidator(db)
    await apartment_validator.validate_file_type(excel_file)

    content = await excel_file.read()
    await apartment_validator.validate_file_size(len(content))

    df = pd.read_excel(BytesIO(content))
    column_names = df.columns.values.tolist()

    await apartment_validator.http_validate_bulk_create(
        building_id=building_id,
        column_names=column_names
    )

    result = await db.execute(
        select(BuildingCoefficientType)
        .join(BuildingCoefficientType.building_coefficient)
        .where(BuildingCoefficient.building_id == building_id)
    )
    building_bcts = result.scalars().all()

    bct_dict = {bct.name: bct for bct in building_bcts}
    errors = []
    for row_index, row in df.iterrows():
        row_has_error = False

        async with db.begin_nested():  # SAVEPOINT
            new_apartment = Apartment(
                building_id=building_id,
                number=str(row["number"]),
                floor=int(row["floor"]),
                area=row["area"],
                room_count=int(row["room_count"]),
            )

            new_apartment.building_coefficient_types = []
            db.add(new_apartment)
            await db.flush()

            bct_ids = []

            for bc_name in column_names[4:]:
                if pd.isna(row[bc_name]):
                    errors.append(f"{row_index + 2} - qatorda bo'shliq")
                    row_has_error = True
                    break

                bct_obj = bct_dict.get(row[bc_name])
                if not bct_obj:
                    errors.append(f"{row_index + 2} - qatorda xatolik ({bc_name})")
                    row_has_error = True
                    break

                bct_ids.append(bct_obj.id)
                new_apartment.building_coefficient_types.append(bct_obj)

            if row_has_error:
                await db.rollback()
                continue

            new_apartment.final_price = await recalculate_final_price(
                db=db,
                building_id=building_id,
                bct_ids=bct_ids
            )

    # commit all successful rows
    await db.commit()

    if errors:
        return JSONResponse(status_code=207, content={"errors": errors})

    return {"detail": "success"}


