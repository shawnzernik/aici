import os

class FileHelper:
    def list(self, dir, ext):
        ret = []
        abs_dir = os.path.abspath(dir)
        print(f"Listing files in directory: {abs_dir}")
        for file in os.listdir(abs_dir):
            if file.endswith(ext):
                ret.append(file.replace(ext, ""))
        return ret
        
    def read(self, name):   
        abs_path = os.path.abspath(name)
        print(f"Reading file: {abs_path}")
        with open(abs_path, "r") as file:
            ret = file.read()
        return ret
    
    def save(self, name, contents):
        abs_path = os.path.abspath(name)
        print(f"Saving file: {abs_path}")
        with open(abs_path, "w") as file:
            file.write(contents)
        return { "message": "saved" }
    
    def delete(self, name):
        abs_path = os.path.abspath(name)
        print(f"Deleting file: {abs_path}")
        os.remove(abs_path)
        return { "message": "deleted" }