#!/bin/bash

docker-compose up -d

cd ./back

python3 -m venv venv

source venv/bin/activate

pip install fastapi motor pydantic uvicorn bson

uvicorn main:app --reload