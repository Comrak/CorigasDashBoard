from .database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class CentroComercial(Base):
    __tablename__ = 'centros_comerciales'
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), index=True)  # Aquí especificamos un tamaño máximo de 100 caracteres
    ubicacion = Column(String(200))  # Aquí especificamos un tamaño máximo de 200 caracteres

    # Relación con Locales
    locales = relationship("Local", back_populates="centro_comercial")

class Local(Base):
    __tablename__ = 'locales'
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))  # Tamaño máximo de 100 caracteres
    codigo = Column(String(50), index=True)  # Tamaño máximo de 50 caracteres
    centro_comercial_id = Column(Integer, ForeignKey('centros_comerciales.id'))

    # Relación con el centro comercial
    centro_comercial = relationship("CentroComercial", back_populates="locales")

    # Relación con los cálculos mensuales
    calculos_mensuales = relationship("CalculoMensual", back_populates="local")

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
    username = Column(String(50), unique=True, index=True)  # Longitud definida para 'username'
    hashed_password = Column(String(255))  # Longitud definida para 'hashed_password'