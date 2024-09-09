from fastapi import FastAPI
from app.database import SessionLocal, init_db
from sqlalchemy.orm import Session
from .routers import admin
from .auth import get_password_hash
from .models import User, CentroComercial, Local
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
app = FastAPI()

# Configurar las políticas de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://http://127.0.0.1:8000","http://localhost:5173"],  # Puedes permitir solo este origen o usar ["*"] para permitir todos
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todas las cabeceras
)

# Inicializa la base de datos al arrancar la app
@app.on_event("startup")
def startup_event():
    init_db()

# Incluye tus routers
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

def init_sample_data(db: Session):
    # Crear usuario administrador de ejemplo
    admin_username = "admin"
    existing_user = db.query(User).filter(User.username == admin_username).first()
    if not existing_user:
        hashed_password = get_password_hash("admin123")
        new_user = User(username=admin_username, hashed_password=hashed_password)
        db.add(new_user)

    # Crear centros comerciales de ejemplo
    if not db.query(CentroComercial).first():
        centro1 = CentroComercial(nombre="Centro Comercial 1", ubicacion="Ubicación 1")
        centro2 = CentroComercial(nombre="Centro Comercial 2", ubicacion="Ubicación 2")
        db.add(centro1)
        db.add(centro2)

        # Crear locales de ejemplo
        local1 = Local(nombre="Local 1", codigo="CC1-001", centro_comercial=centro1)
        local2 = Local(nombre="Local 2", codigo="CC1-002", centro_comercial=centro1)
        local3 = Local(nombre="Local 3", codigo="CC2-001", centro_comercial=centro2)
        db.add(local1)
        db.add(local2)
        db.add(local3)

    db.commit()

# Ejecutar la inicialización de datos de prueba al iniciar la aplicación
@app.on_event("startup")
def startup_event():
    init_db()
    db = SessionLocal()
    try:
        init_sample_data(db)
    finally:
        db.close()