USAGE:

# Prerequisites
## MacOS spesific packages (via homebrew)
```
brew install mysql 
brew install pkg-config  
brew install openssl   
```
## Windows packages (WSL)
```
apt install mysql-client-core-8.0
apt install mysql-server
apt install python3.12-venv
```
## Make a config file
```bash
cd backend/server/
touch my.cnf
# see my.cnf.example for how to configure
```
# Set up virtual environment
```bash
# Set up python virtual environment inside backend folder
python -m venv [environment-name]

# activate the virtual enviroment
source [environment-name]/bin/activate

# Install dependencies
pip install -r requirements.txt

# start mysql
brew services start mysql # MacOS
systemctl start mysql     # Linux and windows with wsl

# Change dir to sql
cd backend/sql

# Run sql 
sudo mysql 

```
## Create database:
```sql
CREATE database [name];
USE [name];
SOURCE ElectroMartV2.sql;
SOURCE Mockdata.sql;
```
# Start server
Go to server folder, located at: `backend/server`

run `python manage.py runserver`

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
