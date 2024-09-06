import uvicorn
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.responses import JSONResponse
from http.client import HTTPException

from logic.aici import Aici
from config import Config
from services.chat import Chat
from services.datasets import Datasets
from logic.monitor import Monitor
from services.suggestions import Suggestions
from services.configuration import Configuration

class WebApp:
    def main(self):
        print(f"## WebApp.main()")
        
        self.app = FastAPI()
        self.app.mount(Config.static_uri, StaticFiles(directory=Config.static_dir))
        self.app.mount(Config.scripts_uri, StaticFiles(directory=Config.scripts_dir))
        
        self.app.add_api_route("/", self.default, methods=["GET"])
        self.app.add_api_route("/health/live", self.live, methods=["GET"])
        self.app.add_api_route("/health/ready", self.ready, methods=["GET"])
        self.app.add_api_route("/health/stats", self.stats, methods=["GET"])

        Datasets(self)
        Suggestions(self)
        Configuration(self)
        Chat(self)
        
        self.load_aici()

        uvicorn.run(self.app, host=Config.http_address, port=Config.http_port)

    def load_aici(self):
        try:
            self.aici = Aici()
            self.aici.load()
        except Exception as e:
            print(f"## WebApp.load_aici() - Error: {e}")
            pass

    async def default(self):
        return RedirectResponse(url=Config.default_page)
    
    async def live(self):
        return JSONResponse(content={ "status": "ok" })

    async def ready(self):
        return JSONResponse(content={ "status": "ok" })

    async def stats(self):
        try:
            return JSONResponse(content={
                "memory": Monitor().percentage_memory_used(),
                "cpu": Monitor().percentage_cpu_used()}
            )
        except Exception as e:
            print(f"## WebApp.stats() - Error: {e}")
            raise HTTPException(status_code=500, detail=str(e))
