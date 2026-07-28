import sys
import os

# Include backend directory in python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app
