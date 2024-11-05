from models import MessageModel
from database import collection
from bson import ObjectId
import asyncio
import bson  # Ensure bson is installed: pip install bson

from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
import asyncio
import uuid



async def iaAnswer(message: str, chat_id: str) -> AsyncGenerator[str, None]:
    response = switchCaseMessage(message)
    

    # Save the response message to the database
    new_message = MessageModel(
        id=uuid.uuid4(),
        chat_id=chat_id,
        message=response,
        isMyMessage=False
    )


    
    await collection.update_one(
        {"_id": str(chat_id)},
        {"$push": {"messages": new_message.dict()}}
    )
    
    for char in response:
        yield char
        await asyncio.sleep(0.1)  # Simulates a delay for streaming





def switchCaseMessage(message:str):
        match message.lower():
            case "oi":
                return "Olá! Como posso te ajudar?"
            case "tchau":
                return "Até mais!"
            case "bom dia":
                return "Bom dia! Como posso te ajudar?"
            case "boa tarde":
                return "Boa tarde! Como posso te ajudar?"
            case "boa noite":
                return "Boa noite! Como posso te ajudar?"
            case "qual o seu nome?":
                return "Me chamo IA. Como posso te ajudar?"
            case "qual a sua função?":
                return "Minha função é te ajudar a encontrar informações."
            case "qual a sua idade?":
                return "Não tenho idade. Sou uma inteligência artificial."
            case "qual a sua cor favorita?":
                return "Não tenho cor favorita. Sou uma inteligência artificial."
            case "qual a sua comida favorita?":
                return "Não tenho comida favorita. Sou uma inteligência artificial."
            case "qual a sua bebida favorita?":
                return "Não tenho bebida favorita. Sou uma inteligência artificial."
            case "qual a sua música favorita?":
                return "Não tenho música favorita. Sou uma inteligência artificial."
            case "não":
                return "Tudo bem, talvez se quiser fazer algo mais picante... pode falar comigo"
            case "sim":
                return "Que bom! Em que posso te ajudar?"
            case "opa vamos fazer algo mais picante":
                return "Claro! O que você gostaria de fazer?"
            case "qual a capital do Brasil?":
                return "Brasília."
            case "gostaria de fazer websexo":
                return "Desculpe, não sou programado para isso."
            case "solta um peidinho":
                return "Prrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr... ops!"
            case _:
                return "Desculpe, não entendi. Poderia reformular a pergunta?"