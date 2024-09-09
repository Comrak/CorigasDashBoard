from pydantic import BaseModel
from typing import List, Optional
from datetime import date
class LocalCreate(BaseModel):
    nombre: str
    codigo: str
    razon_social : str
    persona_contacto : Optional[str] = None 
    mail_contacto : Optional[str] = None 
    telefono_contacto : Optional[str] = None 
    fecha_registro : date
    status: Optional[bool] = True

class LocalResponse(BaseModel):
    id: int
    nombre: str
    codigo: str
    persona_contacto :  Optional[str]
    mail_contacto :  Optional[str]
    telefono_contacto :  Optional[str]
    fecha_registro : date
    status: bool = True
    centro_comercial_id: int

    class Config:
        orm_mode = True

class CentroComercialCreate(BaseModel):
    nombre: str
    ubicacion: str
    capacidad_litros: float
    detalle: Optional[str]
    persona_contacto: Optional[str]
    mail_contacto: Optional[str]
    telefono_contacto: Optional[str]
    fecha_registro: date
    status: bool = True

class CentroComercialResponse(BaseModel):
    id: int
    nombre: str
    ubicacion: str
    capacidad_litros: float
    detalle: Optional[str]
    persona_contacto: Optional[str]
    mail_contacto: Optional[str]
    telefono_contacto: Optional[str]
    fecha_registro: date
    status: bool = True
    locales: List[LocalResponse]  # Incluir los locales asociados
    class Config:
        orm_mode = True

class CalculoGLPRequest(BaseModel):
    local_codigo: str
    lectura_inicial: float
    lectura_final: float
    precio_litro: float

class CalculoGLPResponse(BaseModel):
    local: str
    litros_consumidos: float
    costo_total: float

class ConsumoCreate(BaseModel):
    id: int
    mes: int
    semana: int
    lectura_inicial: float
    lectura_final: float
    m3: Optional[float]
    litros: Optional[float]
    precio_por_litro_bs: Optional[float]
    precio_por_litro_dolares: Optional[float]
    fecha_registro: date

class ConsumoResponse(BaseModel):
    mes: int
    semana : int
    lectura_inicial : float
    lectura_final : float
    m3 : Optional[float] = None
    litros : Optional[float] = None
    precio_por_litro_bs : Optional[float] = None
    precio_por_litro_dolares : Optional[float] = None
    fecha_registro : date