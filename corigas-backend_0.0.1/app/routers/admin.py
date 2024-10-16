from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from ..database import SessionLocal, engine
from ..models import CentroComercial, Local, CalculoMensual,Consumo 
from ..schemas import CentroComercialCreate, CentroComercialResponse,CalculoGLPRequest, CalculoGLPResponse,LocalCreate, LocalResponse,ConsumoCreate,ConsumoResponse
from ..database import get_db
from ..models import User,Local, CalculoMensual
from ..auth import authenticate_user, create_access_token, get_password_hash
from fastapi.security import OAuth2PasswordRequestForm
import pandas as pd

router = APIRouter()
# Endpoint para añadir un local a un centro comercial
@router.post("/centros_comerciales/{centro_comercial_id}/locales", response_model=LocalResponse)
def add_local_to_centro_comercial(
    centro_comercial_id: int, local: LocalCreate, db: Session = Depends(get_db)
):
    # Verificar que el centro comercial existe
    centro_comercial = db.query(CentroComercial).filter(CentroComercial.id == centro_comercial_id).first()
    if not centro_comercial:
        raise HTTPException(status_code=404, detail="Centro Comercial no encontrado")

    # Crear un nuevo local y asociarlo al centro comercial
    nuevo_local = Local(
        nombre=local.nombre,
        codigo=local.codigo,
        codigoA2 = local.codigoA2,
        razon_social = local.razon_social,
        centro_comercial_id=centro_comercial_id,
        persona_contacto=local.persona_contacto,
        mail_contacto=local.mail_contacto,
        telefono_contacto=local.telefono_contacto, 
        fecha_registro=local.fecha_registro
    )
    db.add(nuevo_local)
    db.commit()
    db.refresh(nuevo_local)

    return nuevo_local

# Endpoint para obtener todos los locales de un centro comercial
@router.get("/centros_comerciales/{centro_comercial_id}/locales", response_model=list[LocalResponse])
def get_locales_by_centro_comercial(centro_comercial_id: int, db: Session = Depends(get_db)):
    # Verificar que el centro comercial existe
    centro_comercial = db.query(CentroComercial).filter(CentroComercial.id == centro_comercial_id).first()
    if not centro_comercial:
        raise HTTPException(status_code=404, detail="Centro Comercial no encontrado")

    # Obtener los locales asociados
    locales = db.query(Local).filter(Local.centro_comercial_id == centro_comercial_id).all()
    return locales

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

# Endpoint para obtener un centro comercial por ID
@router.get("/centros_comerciales/{centro_comercial_id}", response_model=CentroComercialResponse)
def get_centro_comercial_by_id(centro_comercial_id: int, db: Session = Depends(get_db)):
    # Buscar el centro comercial por ID
    print(centro_comercial_id)
    centro_comercial = db.query(CentroComercial).filter(CentroComercial.id == centro_comercial_id).first()
    print(centro_comercial)
    # Si no se encuentra el centro comercial, lanzar un error 404
    if not centro_comercial:
        raise HTTPException(status_code=404, detail="Centro Comercial no encontrado")

    # Devolver los detalles del centro comercial
    return centro_comercial


# Endpoint para crear un nuevo centro comercial
@router.post("/centros_comerciales/", response_model=CentroComercialResponse)
def create_centro_comercial(centro: CentroComercialCreate, db: Session = Depends(get_db)):
    db_centro = CentroComercial(nombre=centro.nombre, ubicacion=centro.ubicacion, capacidad_litros=centro.capacidad_litros, detalle=centro.detalle,persona_contacto=centro.persona_contacto,mail_contacto=centro.mail_contacto,telefono_contacto=centro.telefono_contacto, fecha_registro=centro.fecha_registro )
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

def calcular_constante(db: Session, centro_comercial_id: int, litros_despachados: float):
    locales = db.query(Local).filter(Local.centro_comercial_id == centro_comercial_id).all()
    sumatoria_m3 = sum([local.m3 for local in locales if local.m3 > 0])
    if sumatoria_m3 > 0:
        return litros_despachados / sumatoria_m3
    return 0

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

@router.post("/locales/{local_id}/consumos", response_model=ConsumoResponse)
def create_consumo(local_id: int, consumo: ConsumoCreate, db: Session = Depends(get_db)):
    local = db.query(Local).filter(Local.id == local_id).first()

    if not local:
        raise HTTPException(status_code=404, detail="Local no encontrado")

    # Calcular el m3 (lectura_final - lectura_inicial)
    #m3 = consumo.lectura_final - consumo.lectura_inicial

    # Suponemos que ya tenemos la constante de litros, la puedes calcular como quieras
    # constante = calcular_constante_litros(db)  # Función para calcular la constante global
    # litros = m3 * constante

    nuevo_consumo = Consumo(
        lectura_inicial=consumo.lectura_inicial,
        lectura_final=consumo.lectura_final,
        mes=consumo.mes,
        #m3=m3,
        #litros=litros,
        local_id=local_id
    )

    db.add(nuevo_consumo)
    db.commit()
    db.refresh(nuevo_consumo)

    return nuevo_consumo

@router.get("/locales/{local_id}/consumos", response_model=list[ConsumoResponse])
def get_consumos_by_local(local_id: int, db: Session = Depends(get_db)):
    local = db.query(Local).filter(Local.id == local_id).first()

    if not local:
        raise HTTPException(status_code=404, detail="Local no encontrado")

    consumos = db.query(Consumo).filter(Consumo.local_id == local_id).all()
    return consumos

@router.get("/centro_comercial/{centros_comerciales_id}_{mes}/consumos", response_model=list[ConsumoResponse])
def get_consumos_by_centro_comercial(centros_comerciales_id: int,mes:int, db: Session = Depends(get_db)):
    centros_comerciales = db.query(CentroComercial).filter(CentroComercial.id == centros_comerciales_id).first()

    if not centros_comerciales:
        raise HTTPException(status_code=404, detail="Local no encontrado")

    consumos = db.query(Consumo).filter(Consumo.centro_comercial_id == centros_comerciales and Consumo.mes == mes).all()
    return consumos


@router.post("/locales/{local_id}/calcular_glp", response_model=CalculoGLPResponse)
def calcular_glp(local_id: int, calculo: CalculoGLPRequest, db: Session = Depends(get_db)):
    # Verificar que el local existe
    local = db.query(Local).filter(Local.id == local_id).first()
    if not local:
        raise HTTPException(status_code=404, detail="Local no encontrado")

    # Calcular el consumo de litros
    m3_consumidos = calculo.lectura_final - calculo.lectura_inicial
    litros_consumidos = m3_consumidos * 3.85  # Esta es la constante de conversión, ajusta según tus necesidades

    # Calcular el costo total
    costo_total = litros_consumidos * calculo.precio_por_litro

    # Guardar el cálculo en la base de datos
    nuevo_calculo = CalculoMensual(
        local_id=local_id,
        lectura_inicial=calculo.lectura_inicial,
        lectura_final=calculo.lectura_final,
        litros=litros_consumidos,
        precio=costo_total
    )
    db.add(nuevo_calculo)
    db.commit()
    db.refresh(nuevo_calculo)

    return CalculoGLPResponse(
        local=local.nombre,
        litros_consumidos=litros_consumidos,
        costo_total=costo_total,
        fecha=nuevo_calculo.fecha
    )

@router.get("/locales/{local_id}/calculos", response_model=list[CalculoGLPResponse])
def get_calculos_anteriores(local_id: int, db: Session = Depends(get_db)):
    # Verificar que el local existe
    local = db.query(Local).filter(Local.id == local_id).first()
    if not local:
        raise HTTPException(status_code=404, detail="Local no encontrado")

    # Obtener los cálculos anteriores
    calculos = db.query(CalculoMensual).filter(CalculoMensual.local_id == local_id).all()

    return [CalculoGLPResponse(
        local=local.nombre,
        litros_consumidos=calculo.litros,
        costo_total=calculo.precio,
        fecha=calculo.fecha
    ) for calculo in calculos]

@router.get("/centro_comercial/{centro_id}/calculos/export/excel")
def exportar_calculos_excel(centro_id: int, db: Session = Depends(get_db)):
    centro = db.query(CentroComercial).filter(CentroComercial.id == centro_id).first()
    if not centro:
        raise HTTPException(status_code=404, detail="Centro comercial no encontrado")

    locales = db.query(Local).filter(Local.centro_comercial_id == centro_id).all()
    calculos = []
    for local in locales:
        for calculo in local.calculos_mensuales:
            calculos.append({
                "Local": local.nombre,
                "Lectura Inicial": calculo.lectura_inicial,
                "Lectura Final": calculo.lectura_final,
                "Litros Consumidos": calculo.litros,
                "Costo Total": calculo.precio,
                "Fecha": calculo.fecha
            })

    # Generar un DataFrame
    df = pd.DataFrame(calculos)
    
    # Guardar a un archivo Excel
    excel_file = '/mnt/data/calculos.xlsx'
    df.to_excel(excel_file, index=False)

    # Retornar el archivo Excel
    return Response(content=open(excel_file, 'rb').read(), media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers={
        "Content-Disposition": f"attachment; filename=calculos_{centro.nombre}.xlsx"
    })