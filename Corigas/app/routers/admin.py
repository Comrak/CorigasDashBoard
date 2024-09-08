from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import SessionLocal, engine
from ..models import CentroComercial, Local, CalculoMensual
from ..schemas import CentroComercialCreate, CentroComercialResponse,CalculoGLPRequest, CalculoGLPResponse
from ..database import get_db
from ..models import User,Local, CalculoMensual
from ..auth import authenticate_user, create_access_token, get_password_hash
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint para obtener todos los centros comerciales
@router.get("/centros_comerciales/", response_model=list[CentroComercialResponse])
def get_centros_comerciales(db: Session = Depends(get_db)):
    return db.query(CentroComercial).all()

# Endpoint para crear un nuevo centro comercial
@router.post("/centros_comerciales/", response_model=CentroComercialResponse)
def create_centro_comercial(centro: CentroComercialCreate, db: Session = Depends(get_db)):
    db_centro = CentroComercial(nombre=centro.nombre, ubicacion=centro.ubicacion)
    db.add(db_centro)
    db.commit()
    db.refresh(db_centro)
    return db_centro

# Endpoint para registrar nuevos administradores
@router.post("/register/")
def register_user(username: str, password: str, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(password)
    user = User(username=username, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered successfully"}

# Endpoint para login de administrador
@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/calcular_glp/", response_model=CalculoGLPResponse)
def calcular_glp(calculo: CalculoGLPRequest, db: Session = Depends(get_db)):
    # Verificar que el local existe
    local = db.query(Local).filter(Local.codigo == calculo.local_codigo).first()
    if not local:
        raise HTTPException(status_code=404, detail="Local no encontrado")

    # Calcular el consumo de litros
    m3_consumidos = calculo.lectura_final - calculo.lectura_inicial
    litros_consumidos = m3_consumidos * 3.85

    # Calcular el costo total
    costo_total = litros_consumidos * calculo.precio_litro

    # Guardar el cálculo en la base de datos
    nuevo_calculo = CalculoMensual(
        local_id=local.id,
        lectura_inicial=calculo.lectura_inicial,
        lectura_final=calculo.lectura_final,
        m3=m3_consumidos,
        litros=litros_consumidos,
        precio=costo_total,
    )
    db.add(nuevo_calculo)
    db.commit()
    db.refresh(nuevo_calculo)

    # Retornar los resultados del cálculo
    return CalculoGLPResponse(
        local=local.nombre,
        litros_consumidos=litros_consumidos,
        costo_total=costo_total
    )