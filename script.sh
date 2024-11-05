#!/bin/bash

# Iniciar Docker Compose
docker-compose up -d

# Iniciar aplicativo React
cd chatbot
npm install
npm start &

# Instalar dependências do FastAPI
cd ../back
pip install fastapi motor pydantic uvicorn

# Iniciar API FastAPI
uvicorn main:app --reload &