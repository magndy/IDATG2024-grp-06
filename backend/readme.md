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
pip install -r requirements.txt

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


# Endpoint queries
**Query by cart for cart-items** // displays items by cart id 
- http://127.0.0.1:8000/api/cart-items/?cartid=1
**Query by userid for shopping carts** // displays items by userid
- http://127.0.0.1:8000/api/shopping-carts/?userid=2
**Query by name for category** 
- http://127.0.0.1:8000/api/products/?category=Laptops

# Resources
https://www.w3schools.com/django/django_create_project.php
https://vinoth93.medium.com/connect-mysql-phpmyadmin-with-django-d41af2fd7953
