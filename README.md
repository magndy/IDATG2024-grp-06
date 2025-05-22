
---
# IDATG2024 - Group 06 - Project

This is the repo for our group project in IDATG2024. For the documentation on the project, please refer to the pdf in Inspera.
Below is a detailed Setup/installation guide in markdown for easier use. This guide is also provided in the pdf documentation

# Project Setup Guide

This guide will walk you through setting up the project environment. All commands are also available in the `README.MD` file in the root of the GitHub repository for easier copying.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Python**
* **Node.js** (version 20.0 or newer)
* **npm**

To install **Node.js** (version 20.0), it's recommended to use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) (Node Version Manager).

1.  Open your terminal.
2.  Run the following commands:

```bash
nvm install 20
nvm use 20
```
3.  Reopen your terminal after installation.

---

## Backend Setup

Let's get the backend up and running.

### 1. Install Packages

#### macOS

```bash
brew install mysql
brew install pkg-config
brew install openssl
```

#### Linux

```bash
sudo apt install mysql-client-core-8.0
sudo apt install mysql-server
sudo apt install python3.12-venv
```

### 2. Create Configuration File

1.  Navigate to the backend server directory:

```bash
cd backend/server/
```
2.  Create the configuration file:

```bash
touch my.cnf
```
3.  **Important**: Refer to `my.cnf.example` for the configuration structure. You need to add your **MySQL username** and **password** to this `my.cnf` file.

```ini
# Example content for my.cnf
[client]
database = ElectroMart
user = root
password = root
```

### 3. Setup Virtual Environment

1.  Navigate to the backend root folder:

```bash
cd ..
```
2.  Create a Python virtual environment (replace `[environment-name]` with your preferred name, e.g., `venv`):

```bash
python3 -m venv [environment-name]
# Or if python3 is not aliased, you might use:
python -m venv [environment-name]
```
3.  Activate the virtual environment:

```bash
source [environment-name]/bin/activate
```
4.  Install dependencies:

```bash
pip install -r requirements.txt
```

### 4. Setup MySQL

1.  Start the MySQL service:

* **macOS:**
```bash
brew services start mysql
```
* **Linux and Windows with WSL:**
```bash
sudo systemctl start mysql
```

2.  Change directory to `sql`:

```bash
cd sql
```
3.  Run MySQL:

```bash
sudo mysql
```

#### If you encounter an error while logging in because you don't know the MySQL password, follow these steps to reset it: (otherwise skip ahead to [5. Create the database](#5-create-the-database))


1.  Stop MySQL:
```bash
sudo systemctl stop mysql
```
2.  Start MySQL with authentication disabled:
```bash
sudo mkdir -p /var/run/mysqld
sudo chown mysql:mysql /var/run/mysqld
sudo mysqld_safe --skip-grant-tables &
```
3.  Wait about 10 seconds, then open a **new terminal** and run:
```bash
mysql
```
4.  Inside the MySQL prompt, execute the following commands (change `'root!'` if you want a different password):
```sql
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root!';
FLUSH PRIVILEGES;
EXIT;
```
5.  Go back to the terminal where `mysqld_safe` is running and press `Ctrl+C` to stop it.
6.  Restart MySQL normally:
```bash
sudo systemctl start mysql
```
7.  Log in with the new username and password (following this example, user is `root` and password is `root`):
```bash
mysql -u root -p
```

### 5. Create the Database

Inside the MySQL prompt:

1.  Create your database (replace `[name]` with your desired database name):

```sql
CREATE DATABASE [name];
```
2.  Select the database:

```sql
USE [name];
```
3.  Source the schema and mock data:

```sql
SOURCE ElectroMartV2.sql;
SOURCE Mockdata.sql;
```

### 6. Start Backend Server

1.  Navigate to the server directory:

```bash
cd ../server
```
2.  Apply database migrations:

```bash
python3 manage.py migrate
# Or if python3 is not aliased:
python manage.py migrate
```
3.  Run the development server:

```bash
python3 manage.py runserver
# Or if python3 is not aliased:
python manage.py runserver
```

**Make sure** the `backend/server/my.cnf` file contains the same **username**, **password**, and **database name** that you set up in MySQL.

The server should now be running on `http://localhost:8000/api`.

---

## Frontend Setup

### 1. Install Packages

1.  Navigate to the frontend directory:

```bash
cd electromart-frontend
```
2.  Install npm packages:

```bash
npm install
```

### 2. Start the Frontend

1.  Run the development server:

```bash
npm run dev
```

The frontend should now be accessible on `http://localhost:5173` 🎉.

---