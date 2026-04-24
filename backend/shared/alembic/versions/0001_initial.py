"""initial migration

Revision ID: 0001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'organismos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nombre', sa.String(length=255), nullable=False),
        sa.Column('rut', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'usuarios',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nombre', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('rol', sa.String(length=50), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )

    op.create_table(
        'pac',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organismo_id', sa.Integer(), nullable=False),
        sa.Column('usuario_id', sa.Integer(), nullable=False),
        sa.Column('nombre', sa.String(length=255), nullable=False),
        sa.Column('fecha_creacion', sa.Date(), nullable=False),
        sa.Column('estado', sa.String(length=50), nullable=False),
        sa.ForeignKeyConstraint('organismo_id', ['organismos.id']),
        sa.ForeignKeyConstraint('usuario_id', ['usuarios.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'requerimientos',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('pac_id', sa.Integer(), nullable=False),
        sa.Column('descripcion', sa.Text(), nullable=False),
        sa.Column('monto_estimado', sa.Numeric(precision=15, scale=2), nullable=False),
        sa.Column('moneda', sa.String(length=10), nullable=False),
        sa.ForeignKeyConstraint('pac_id', ['pac.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('requerimiento_id', sa.Integer(), nullable=False),
        sa.Column('codigo', sa.String(length=100), nullable=False),
        sa.Column('descripcion', sa.Text(), nullable=False),
        sa.Column('cantidad', sa.Integer(), nullable=False),
        sa.Column('precio_unitario', sa.Numeric(precision=15, scale=2), nullable=False),
        sa.ForeignKeyConstraint('requerimiento_id', ['requerimientos.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'versiones_pac',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('pac_id', sa.Integer(), nullable=False),
        sa.Column('version', sa.Integer(), nullable=False),
        sa.Column('fecha', sa.Date(), nullable=False),
        sa.Column('cambios', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint('pac_id', ['pac.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'ordenes_compra',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('numero_oc', sa.String(length=100), nullable=False),
        sa.Column('pac_id', sa.Integer(), nullable=False),
        sa.Column('monto_transado', sa.Numeric(precision=15, scale=2), nullable=False),
        sa.Column('estado', sa.String(length=50), nullable=False),
        sa.ForeignKeyConstraint('pac_id', ['pac.id']),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_index('ix_pac_organismo', 'pac', ['organismo_id'])
    op.create_index('ix_pac_usuario', 'pac', ['usuario_id'])
    op.create_index('ix_requerimientos_pac', 'requerimientos', ['pac_id'])
    op.create_index('ix_items_requerimiento', 'items', ['requerimiento_id'])
    op.create_index('ix_versiones_pac', 'versiones_pac', ['pac_id'])
    op.create_index('ix_ordenes_compra', 'ordenes_compra', ['pac_id'])


def downgrade() -> None:
    op.drop_table('ordenes_compra')
    op.drop_table('versiones_pac')
    op.drop_table('items')
    op.drop_table('requerimientos')
    op.drop_table('pac')
    op.drop_table('usuarios')
    op.drop_table('organismos')
