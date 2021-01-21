# Job board

Test project for DoneStreet job application

# Develop

## Backend
 - Install a python virtual environment to isolate backend requirements, you can use
 this tool: [virtualenvwrapper](https://virtualenvwrapper.readthedocs.io/en/latest/)
 - Setup a virtual environment for the project, the link above will show you how to do it
 - Install python3 in the virtual enviroment
 - Run `pip install -r requirements.txt` in the virtual env to install the projects requirements
 - Run `python manage.py runserver` in the backend directory to start the backend server
 - Ensure you have redis installed and then run `redis-server` to start the redis server
 for caching

## Frontend
- Ensure you have installed [create react app](https://create-react-app.dev/) in your global environment
- In the frontend directory, run `yarn insatll`, to install the frontend requirements
- Run `yarn start` to start the frontend node server
