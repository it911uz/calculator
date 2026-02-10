from io import BytesIO

from fastapi import APIRouter, Depends, UploadFile
from fastapi_filters import FilterValues, create_filters
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import set_committed_value
from starlette import status

import pandas as pd
from starlette.responses import JSONResponse

from apartments.filters import ApartmentFilter
from apartments.managers import ApartmentManager
from apartments.models import Apartment
from apartments.schemas import AddApartmentResponse, AddApartmentBody, UpdateApartmentBody
from apartments.services import recalculate_final_price
from apartments.validations import ApartmentBulkCreateValidator
from auth.dependencies import has_permission
from coefficients.models import BuildingCoefficientType, BuildingCoefficient
from core.db.session import get_db
from core.dependencies import pagination

router = APIRouter(prefix="/apartments", tags=["Apartments"])

"-------------------------------------------------------------------------------------------"

@router.get(
    "/",
    response_model=list[AddApartmentResponse],
    dependencies=[Depends(has_permission("view_apartments"))]
)
async def get_apartment_list(
        db: AsyncSession = Depends(get_db),
        filters: ApartmentFilter = Depends(),
        page: dict = Depends(pagination)
):
    apartment_manager = ApartmentManager(db)
    return await apartment_manager.get_apartment_list(filters, page)

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

    building_bcts = (await db.execute(
        select(BuildingCoefficientType)
        .join(BuildingCoefficientType.building_coefficient)
        .where(BuildingCoefficient.building_id == building_id)
    )).scalars().all()
    bct_dict = {bct.name: bct for bct in building_bcts}

    errors = []
    apartments = []
    for row_index, row in df.iterrows():
        bct_ids = []
        for bc_name in column_names[4:]:
            if not row[bc_name]:
                errors.append(f"{row_index + 2} - qatorda bo'shliq")
                break

            bct_obj = bct_dict.get(row[bc_name])
            if not bct_obj:
                errors.append(f"{row_index + 2} - qatorda xatolik ({bc_name})")
                break

            bct_ids.append(bct_obj.id)
        else:
            new_apartment = Apartment(
                building_id=building_id,
                number=str(row["number"]),
                floor=int(row["floor"]),
                area=row["area"],
                room_count=int(row["room_count"]),
            )

            db.add(new_apartment)
            apartments.append((new_apartment, bct_ids))

    await db.flush()

    for apartment, bct_ids in apartments:
        set_committed_value(apartment, "building_coefficient_types", [])
        for bct_id in bct_ids:
            bct_obj = await db.get(BuildingCoefficientType, bct_id)
            apartment.building_coefficient_types.append(bct_obj)

        apartment.final_price = await recalculate_final_price(
            db=db,
            building_id=building_id,
            bct_ids=bct_ids
        )

    await db.commit()

    if errors:
        return JSONResponse(status_code=207, content={"errors": errors})

    return {"detail": "success"}




