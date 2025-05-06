USAGE:

# Make a config file
```bash
cd backend/server/
touch my.cnf
# see .example for how to configure
```

```bash
# activate the virtual enviroment
source server-venv/bin/activate

# install dependencies
pip freeze > requirements.txt

# MacOS spesific packages (via homebrew)
brew install mysql 
brew install pkg-config  
brew install openssl   

# start mysql (on MacOS)
brew services start mysql


# navigate to server/
python manage.py runserver

# See localhost:8000 in a browser
```

# Resources
https://www.w3schools.com/django/django_create_project.php
https://vinoth93.medium.com/connect-mysql-phpmyadmin-with-django-d41af2fd7953
