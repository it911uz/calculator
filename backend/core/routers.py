from complexes.routers import router as complex_router
from buildings.routers import router as building_router
from apartments.routers import router as apartment_router
from coefficients.routers import router as coefficient_router, coefficient_types_router


routers = [
    complex_router,
    building_router,
    apartment_router,
    coefficient_router,
    coefficient_types_router,
]

