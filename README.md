

Angular front end, Flask API endpoints for access to a Sqlite database using JWT-based security.


#Installation

For the necessary packages, run the following in the root directory:
    >easy_install pip (if you don't have pip installed)
    >pip install flask peewee flask-bcrypt flask-login
    >bower install
    >npm install gulp -g
    >npm install
    >gulp build

To run and debug the server, run in your root (in two separate terminals):

    >python app.py
    >gulp serve

After initializing the app once, the database will be in the root folder. Access this via:

    >sqlite3 which.db

For better display of data, run both of these commands within Sqlite3:

    >.headers on
    >.mode columns
