import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

os.environ['JWT_SECRET'] = 'testsecret'
os.environ['POSTGRES_HOST'] = 'localhost'
os.environ['POSTGRES_DB'] = 'test_db'
os.environ['REDIS_HOST'] = 'localhost'

import pytest
from unittest.mock import MagicMock, patch