from motor.motor_asyncio import AsyncIOMotorClient
from urllib.parse import quote_plus
import os
import bson

username = "root"
password = quote_plus("senha1234")
host = "localhost"
port = 27017

# Monte a URL de conexão com o MongoDB
MONGO_URL = os.getenv("MONGO_URI", f"mongodb://{username}:{password}@{host}:{port}")

# Conexão com o MongoDB
client = AsyncIOMotorClient(MONGO_URL)
database = client["local"]
collection = database["chats"]