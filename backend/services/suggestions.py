from fastapi.params import Body
from fastapi import HTTPException
from config import Config
from logic.filehelper import FileHelper

class Suggestions:
    def __init__(self, webapp):
        webapp.app.add_api_route("/api/v0/suggestions", self.list, methods=["GET"])
        webapp.app.add_api_route("/api/v0/suggestion/{name}", self.read, methods=["GET"])
        webapp.app.add_api_route("/api/v0/suggestion/{name}", self.save, methods=["PUT"])
        webapp.app.add_api_route("/api/v0/suggestion/{name}", self.delete, methods=["DELETE"])
    
    async def list(self):
        try:
            return FileHelper().list(Config.suggestions_dir, ".ds.json")
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))
    
    async def read(self, name: str):
        try:
            return FileHelper().read(Config.suggestions_dir + "/" + name + ".ds.json")
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))

    async def save(self, name: str, data: str = Body(...)):
        try:
            return FileHelper().save(Config.suggestions_dir + "/" + name + ".ds.json", data)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))

    async def delete(self, name: str):
        try:
            return FileHelper().delete(Config.suggestions_dir + "/" + name + ".ds.json")
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))
