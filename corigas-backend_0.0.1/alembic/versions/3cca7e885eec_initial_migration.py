"""initial migration

Revision ID: 3cca7e885eec
Revises: 
Create Date: 2024-08-25 18:26:25.964852

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3cca7e885eec'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('centros_comerciales',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=100), nullable=True),
    sa.Column('ubicacion', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_centros_comerciales_id'), 'centros_comerciales', ['id'], unique=False)
    op.create_index(op.f('ix_centros_comerciales_nombre'), 'centros_comerciales', ['nombre'], unique=False)
    op.create_table('locales',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('nombre', sa.String(length=100), nullable=True),
    sa.Column('codigo', sa.String(length=50), nullable=True),
    sa.Column('centro_comercial_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['centro_comercial_id'], ['centros_comerciales.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_locales_codigo'), 'locales', ['codigo'], unique=False)
    op.create_index(op.f('ix_locales_id'), 'locales', ['id'], unique=False)
    op.create_table('calculos_mensuales',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('local_id', sa.Integer(), nullable=True),
    sa.Column('fecha', sa.DateTime(), nullable=True),
    sa.Column('lectura_inicial', sa.Float(), nullable=True),
    sa.Column('lectura_final', sa.Float(), nullable=True),
    sa.Column('m3', sa.Float(), nullable=True),
    sa.Column('litros', sa.Float(), nullable=True),
    sa.Column('precio', sa.Float(), nullable=True),
    sa.ForeignKeyConstraint(['local_id'], ['locales.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_calculos_mensuales_id'), 'calculos_mensuales', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_calculos_mensuales_id'), table_name='calculos_mensuales')
    op.drop_table('calculos_mensuales')
    op.drop_index(op.f('ix_locales_id'), table_name='locales')
    op.drop_index(op.f('ix_locales_codigo'), table_name='locales')
    op.drop_table('locales')
    op.drop_index(op.f('ix_centros_comerciales_nombre'), table_name='centros_comerciales')
    op.drop_index(op.f('ix_centros_comerciales_id'), table_name='centros_comerciales')
    op.drop_table('centros_comerciales')
    # ### end Alembic commands ###
