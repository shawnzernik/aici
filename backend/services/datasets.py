from fastapi.params import Body
from fastapi import HTTPException
from config import Config
from logic.filehelper import FileHelper

class Datasets:
    def __init__(self, webapp):
        webapp.app.add_api_route("/api/v0/datasets", self.list, methods=["GET"])
        webapp.app.add_api_route("/api/v0/dataset/{name}", self.read, methods=["GET"])
        webapp.app.add_api_route("/api/v0/dataset/{name}", self.save, methods=["PUT"])
        webapp.app.add_api_route("/api/v0/dataset/{name}", self.delete, methods=["DELETE"])

    async def list(self):
        try:
            return FileHelper().list(Config.datasets_dir, ".ds.json")
        except Exception as e:
            print(f"## Datasets.list() - Error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
        
    async def read(self, name: str):
        try:
            return FileHelper().read(Config.datasets_dir + "/" + name + ".ds.json")
        except Exception as e:
            print(f"## Datasets.read() - Error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
            
    async def save(self, name: str, data: str = Body(...)):
        try:
            return FileHelper().save(Config.datasets_dir + "/" + name + ".ds.json", data)
        except Exception as e:
            print(f"## Datasets.save() - Error: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    async def delete(self, name: str):
        try:
            return FileHelper().delete(Config.datasets_dir + "/" + name + ".ds.json")
        except Exception as e:
            print(f"## Datasets.delete() - Error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
