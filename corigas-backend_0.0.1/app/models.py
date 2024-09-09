from .database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, Boolean
from sqlalchemy.orm import relationship

class CentroComercial(Base):
    __tablename__ = 'centros_comerciales'
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), index=True)
    ubicacion = Column(String(200))
    capacidad_litros = Column(Float)
    detalle = Column(String(200))
    persona_contacto = Column(String(50))
    mail_contacto = Column(String(100))
    telefono_contacto = Column(String(100))
    fecha_registro = Column(DateTime)
    status = Column(Boolean, default=True)

    # Relación con Locales
    locales = relationship("Local", back_populates="centro_comercial")

    # Relación con Consumos (corregido el nombre)
    consumos = relationship("Consumo", back_populates="centro_comercial")

class Local(Base):
    __tablename__ = 'locales'
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    codigo = Column(String(50), index=True)
    razon_social = Column(String(200))
    persona_contacto = Column(String(50))
    mail_contacto = Column(String(100))
    telefono_contacto = Column(String(100))
    fecha_registro = Column(DateTime)
    status = Column(Boolean, default=True)
    centro_comercial_id = Column(Integer, ForeignKey('centros_comerciales.id'))

    # Relación con el centro comercial
    centro_comercial = relationship("CentroComercial", back_populates="locales")

    # Relación con los cálculos mensuales
    calculos_mensuales = relationship("CalculoMensual", back_populates="local")

    # Relación con el modelo Consumo
    consumos = relationship("Consumo", back_populates="local")

class CalculoMensual(Base):
    __tablename__ = 'calculos_mensuales'
    
    id = Column(Integer, primary_key=True, index=True)
    local_id = Column(Integer, ForeignKey('locales.id'))
    fecha = Column(DateTime)
    lectura_inicial = Column(Float)
    lectura_final = Column(Float)
    m3 = Column(Float)
    litros = Column(Float)
    precio = Column(Float)

    # Relación con Local
    local = relationship("Local", back_populates="calculos_mensuales")

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))

class Consumo(Base):
    __tablename__ = "consumo"

    id = Column(Integer, primary_key=True, index=True)
    local_id = Column(Integer, ForeignKey("locales.id"))
    centro_comercial_id = Column(Integer, ForeignKey("centros_comerciales.id"))
    mes = Column(Integer)
    semana = Column(Integer)
    lectura_inicial = Column(Float)
    lectura_final = Column(Float)
    m3 = Column(Float)
    litros = Column(Float)
    precio_por_litro_bs = Column(Float)
    precio_por_litro_dolares = Column(Float)
    fecha_registro = Column(DateTime)

    local = relationship("Local", back_populates="consumos")
    centro_comercial = relationship("CentroComercial", back_populates="consumos")  # Corregido aquí también
