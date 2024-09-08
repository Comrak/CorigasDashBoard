from pydantic import BaseModel

class CentroComercialCreate(BaseModel):
    nombre: str
    ubicacion: str

class CentroComercialResponse(BaseModel):
    id: int
    nombre: str
    ubicacion: str

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
