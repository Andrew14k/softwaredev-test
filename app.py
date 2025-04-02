from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost'  # Replace with your MySQL host (default: localhost)
app.config['MYSQL_USER'] = 'root'  # Replace with your MySQL username
app.config['MYSQL_PASSWORD'] = 'password'  # Replace with your MySQL password
app.config['MYSQL_DB'] = 'task_manager'  # Replace with your MySQL database name

# Initialize MySQL
mysql = MySQL(app)

# Database Connection
def get_db_connection():
    connection = mysql.connect(
        host="localhost",
        user="root",
        password="password",
        database="task_manager"
    )
    return connection


@app.route('/tasks', methods=['GET'])
def get_tasks():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    cursor.close()

    # Convert tasks to a list of dictionaries
    tasks_list = []
    for task in tasks:
        task_data = {
            'id': task[0],
            'title': task[1],
            'description': task[2],
            'status': task[3],
            'due_date': task[4]
        }
        tasks_list.append(task_data)

    return jsonify(tasks_list)


@app.route('/tasks', methods=['POST'])
def create_task():
    task_data = request.get_json()
    title = task_data.get('title')
    description = task_data.get('description')
    status = task_data.get('status')
    due_date = task_data.get('due_date')

    cursor = mysql.connection.cursor()
    cursor.execute(
        'INSERT INTO tasks (title, description, status, due_date) VALUES (%s, %s, %s, %s)',
        (title, description, status, due_date)
    )
    
    cursor.close()
    

    return jsonify({'title': title, 'description': description, 'status': status, 'due_date': due_date}), 201

if __name__ == '__main__':
    app.run(debug=True)
