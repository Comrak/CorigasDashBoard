"""Añadir campos codigo a2 a locales

Revision ID: 560ac282ce2c
Revises: 1609f0e3cf8b
Create Date: 2024-09-15 21:19:22.509558

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '560ac282ce2c'
down_revision: Union[str, None] = '1609f0e3cf8b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('locales', sa.Column('codigoA2', sa.String(length=50), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('locales', 'codigoA2')
    # ### end Alembic commands ###
