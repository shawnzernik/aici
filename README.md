# Aici
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

## Server Setup

Get the Ubuntu server up and running, then use the following commands:

```
sudo apt-get update
sudo apt-get -y upgrade

sudo apt install -y python3.12-venv
sudo apt-get install -y python3.12-dev
sudo apt-get install -y libopenmpi-dev

sudo apt-get install -y npm

sudo apt install -y samba
sudo cp /etc/samba/smb.conf /etc/samba/smb.conf.original
```

Edit ```/etc/samba/smb.conf```

```
sudo bash
echo > /etc/samba/smb.conf
exit
sudo vi /etc/samba/smb.conf
```

Paste the following

```
[global]
   # identification
   workgroup = WORKGROUP
   server string = %h server (Samba, Ubuntu)
   
   # logging
   log file = /var/log/samba/log.%m
   max log size = 1000
   logging = file

   panic action = /usr/share/samba/panic-action %d

   # authentication
   server role = standalone server
   obey pam restrictions = yes

   # disable guest
   map to guest = never
   guest account = nobody

[data]
   comment = Data Share
   path = /
   browseable = yes
   read only = no
   guest ok = no
   valid users = @users
```

Then run:

```
sudo useradd --user-group --groups users --shell /usr/sbin/nologin client

sudo passwd client

sudo smbpasswd -a client

sudo systemctl stop smbd nmbd
sudo systemctl start smbd nmbd
```

## Random Notes

pipx ensurepath
pipx install transformers datasets torch

source /home/ubuntu/.local/share/pipx/venvs/transformers/bin/activate

python3 train.py

sudo docker stop b73546cf06b2
sudo systemctl stop ollama
sudo mkfs -t ext4 /dev/nvme1n1
sudo mount /dev/nvme1n1 /drive2
sudo chown -R ubuntu:ubuntu /drive2
sudo chmod -R 775 /drive2
mkdir /drive2/huggingface
mkdir /drive2/smb
