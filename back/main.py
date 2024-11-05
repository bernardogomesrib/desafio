from fastapi import FastAPI, HTTPException
from models import MessageModel, ChatModel
from database import collection
from typing import List
from fastapi.responses import StreamingResponse
from minhaIA import iaAnswer
from fastapi.middleware.cors import CORSMiddleware
import uuid

app = FastAPI()

# Adicione o middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# Rota de exemplo
@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API com FastAPI"}

@app.get("/chats/{chat_id}", response_model=ChatModel)
async def read_user(chat_id: str):
    try:
        chat_uuid = uuid.UUID(chat_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid chat_id format")
    user = await collection.find_one({"_id": str(chat_uuid)})
    if user:
        return user
    else:
        raise HTTPException(status_code=404, detail="Chat não encontrado")

@app.get("/chats", response_model=List[ChatModel])
async def get_all_chats():
    chats = []
    async for chat in collection.find():
        chats.append(chat)
    return chats

@app.post("/chats", response_model=ChatModel)
async def create_chat(chat: ChatModel):
    chat_dict = chat.model_dump(by_alias=True)
    chat_dict["_id"] = str(uuid.uuid4())
    await collection.insert_one(chat_dict)
    return chat_dict

@app.delete("/chats/{chat_id}", response_model=dict)
async def delete_chat(chat_id: str):
    try:
        chat_uuid = uuid.UUID(chat_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid chat_id format")
    result = await collection.delete_one({"_id": str(chat_uuid)})
    if result.deleted_count == 1:
        return {"message": "Chat deletado com sucesso"}
    else:
        raise HTTPException(status_code=404, detail="Chat não encontrado")

@app.post("/chats/{chat_id}/messages", response_model=MessageModel)
async def send_message(chat_id: str, message: MessageModel):
    try:
        chat_uuid = uuid.UUID(chat_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid chat_id format")
    
    chat = await collection.find_one({"_id": str(chat_uuid)})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat não encontrado")
    if chat.get("name")=="":
        await collection.update_one({"_id": str(chat_uuid)}, {"$set": {"name": message.message}})

    message_dict = message.model_dump()
    message_dict["_id"] = str(uuid.uuid4())
    
    await collection.update_one(
        {"_id": str(chat_uuid)},
        {"$push": {"messages": message_dict}}
    )
    
    return StreamingResponse(iaAnswer(message_dict["message"], chat_id), media_type="text/plain")


@app.put("/chats/{chat_id}/messages/{message_id}", response_model=MessageModel)
async def edit_message(chat_id: str, message_id: str, message: MessageModel):
    try:
        chat_uuid = uuid.UUID(chat_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid chat_id format")
    chat = await collection.find_one({"_id": str(chat_uuid)})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat não encontrado")
    
    message_dict = message.model_dump()
    
    result = await collection.update_one(
        {"_id": str(chat_uuid), "messages._id": message_id},
        {"$set": {"messages.$": message_dict}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")
    
    return message_dict

@app.get("/chats/{chat_id}/messages", response_model=List[MessageModel])
async def get_all_messages(chat_id: str):
    try:
        chat_uuid = uuid.UUID(chat_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid chat_id format")
    chat = await collection.find_one({"_id": str(chat_uuid)})
    if not chat:
        return []
    
    return chat.get("messages", [])
