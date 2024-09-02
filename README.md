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

Get the Ubuntu server up and running, setup the NIC for DHCP:

```
sudo vi /etc/netplan/50-cloud-init.yaml
```

With the following contents:

```
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
      dhcp4: yes
```

Save then run:

```
sudo netplan apply
```

Once done, you can see you ip address:

```
ip address
```

Python setup:

```
sudo apt-get update
sudo apt-get -y upgrade
sudo apt install -y python3.12-venv
sudo apt-get install -y python3.12-dev libopenmpi-dev npm python3-pip
```

Clone the repo:

```
git remote set-url origin https://ghp_SOMESECRETKEYFROMGITHUBHERE@github.com/shawnzernik/aici.git
```

You should now have a ```~/aici/``` folder.  Not the path relative to the users folder.

Restart the server for NPM to work.  Change to ```frontend``` folder and run:

```
npm install
npm run build
```

Change to ```backend``` folder and run:

```
sudo pip install --upgrade pip
python3 -m venv ./.venv
source ./.venv/bin/activate
pip install -r requirements.txt 
```

Make sure to install your GPU drivers:

```
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update
sudo apt install -y ubuntu-drivers-common nvidia-cuda-toolkit

lspci -nn | grep -i nvidia

ubuntu-drivers devices

sudo apt-get install nvidia-driver-560
```

Not that everything is installed, you should be able to run it:

```
cd ~/aici/backend
python3 main.py
```

You can open a terminal to the server and use the two following commands to monitor utilization:

```
watch -n 1 nvidia-smi
top
watch -n 1 iostat -h
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
