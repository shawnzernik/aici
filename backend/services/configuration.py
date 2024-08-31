from fastapi.params import Body
from fastapi import HTTPException
from config import Config
from logic.filehelper import FileHelper


class Configuration:
    def __init__(self, webapp):
        webapp.app.add_api_route("/api/v0/config", self.read, methods=["GET"])
        webapp.app.add_api_route("/api/v0/config", self.save, methods=["PUT"])

    async def read(self):
        try:
            return FileHelper().read(Config.config_json)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))

    async def save(self, data: str = Body(...)):
        try:
            return FileHelper().save(Config.config_json, data)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))
