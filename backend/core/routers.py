from complexes.routers import router as complex_router
from buildings.routers import router as building_router
from apartments.routers import router as apartment_router
from coefficients.routers import router as coefficient_router, coefficient_types_router
from auth.routers import router as auth_router
from users.routers import router as users_router
from roles.routers import router as roles_router
from permissions.routers import router as permissions_router


routers = [
    auth_router,
    complex_router,
    building_router,
    apartment_router,
    coefficient_router,
    coefficient_types_router,
    users_router,
    roles_router,
    permissions_router,
]

