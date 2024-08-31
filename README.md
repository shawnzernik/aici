# aici
Artificial Intelligence Continuous Improvement

## Purpose

This application was developed in response to using AI for code generation and programming.  This provides the ability to semd messages to the AI model.  The request and response can be "sugggested" for correction.  You can then used the data set editor to modify the assistants' response for further training.

As a test case, we used Gemma 2 2B IT model to assist in creating the code.  The dataset was built in response to AI answers as we worked through the base application.

### Base Application

This is a TypeScript application using Express on the backend, and React on the front end.

## Folder Structure

- **aici/**
  - **aici/**
    - **datasets/** - JSON datasets used for UI and AI training
    - **suggestions/** - where suggestions are stored till merged into datasets 
    - **backend/** - python server side with Web API and AI model
      - **logic/** - business logic
      - **model/** - data structures to store and send data
        - **config_json.py** - this is the config sent to/from the UI used for AI model
      - **services/** - the web apis
      - **main.py** - this is where the application will start from this file
      - **webapp.py** - the main class that drives FastAPI and routes
      - **config.py** - configuration used to boot the FastAPI server
    - **frontend/** - React TypeScript UI
      - **dist/** - this is where webpack builds to - ephemeral storage only
      - **src/** - TypeScrip sources
      - **static/** - static web content served as "/static"
    - **documentation/** - additional documentation


## Random Notes

pipx ensurepath
pipx install transformers datasets torch

source /home/ubuntu/.local/share/pipx/venvs/transformers/bin/activate

python3 train.py

sudo mkfs -t ext4 /dev/nvme1n1
sudo mount /dev/nvme1n1 /drive2
sudo chown -R ubuntu:ubuntu /drive2
sudo chmod -R 775 /drive2
mkdir /drive2/huggingface
mkdir /drive2/smb
