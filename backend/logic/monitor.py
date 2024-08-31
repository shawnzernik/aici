import psutil

class Monitor:
    def __init__(self):
        pass

    def percentage_memory_used(self):
        return psutil.virtual_memory().percent
    
    def percentage_cpu_used(self):
        return psutil.cpu_percent(interval=1, percpu=False)
