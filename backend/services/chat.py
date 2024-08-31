import json
from fastapi.params import Body
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from config import Config
from logic.filehelper import FileHelper

class Chat:
    def __init__(self, webapp):
        self.webapp = webapp
        webapp.app.add_api_route("/api/v0/chat", self.chat, methods=["POST"])
        webapp.app.add_api_route("/api/v0/reload", self.reload, methods=["GET"])
        webapp.app.add_api_route("/api/v0/train", self.train, methods=["GET"])
        webapp.app.add_api_route("/api/v0/push", self.push_to_hub, methods=["GET"])

    async def chat(self, data: str = Body(...)):
        try:
            messages = json.loads(data)
            response = self.webapp.aici.chat(messages)
            return JSONResponse(content=response)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))

    async def reload(self):
        try:
            self.webapp.load_aici()
            return JSONResponse(content={ "status": "ok" })
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))

    async def train(self):
        try:
            self.webapp.aici.train()
            return JSONResponse(content={"status": "ok"})
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))
        
    async def push_to_hub(self):
        try:
            self.webapp.aici.push_to_hub()
            return JSONResponse(content={"status": "ok"})
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))        