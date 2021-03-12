const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
// Enable access to .env variables
// const dotenv = require("dotenv");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employees_db",
});


// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
   // run the start function after the connection is made to prompt the user
   start();
});

const start = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "View All Roles",
        "Add Role",
        "Remove Role",
        "View All Departments",
        "Add Department",
				"Update Department",
				"Remove Department",
				"Budget by Department",
        "Exit",      
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "View All Employees By Department":
          viewEmployeesByDepartment();
          break;

        case "View All Employees By Manager":
          viewEmployeesByManager();
          break;

        case "Add Employee":
         addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break; 
					
				case "Update Employee":
					updateEmployee();
					break; 
				
				case "Update Employee Role":
					updateEmployeeRole();
					break;

				case "Update Employee Manager":
					updateEmployeeManager();
					break;
				
				case "View All Roles":
					viewAllRoles();
					break;

				case "Add Role":
					addRole();
					break;
						
				case "Remove Role":
					removeRole();
					break;
					
				case "View All Departments":
					viewAllDepartments();
					break;
					
				case "Add Department":
					addDepartment();
					break;
					
				case "Update Department":
					updateDepartment();
					break;
					
				case "Remove Department":
					removeDepartment();
					break;
				
				case "Budget By Department":
					budgetByDepartment();
					break;

        case "Exit":
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const viewAllEmployees = () => {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, role.salary, CONCAT(manager.first_name ,' ', manager.last_name) AS Manager FROM employee LEFT JOIN role ON employee.role_id=role.id LEFT JOIN employee manager ON manager.id=employee.manager_id";
    connection.query(query, (err, res) => {
			if (err) throw err;
			 // Log all results of the SELECT statement
			 console.table(res);   
			 start();
		
		});
};

const viewAllDepartments = () => {
  connection.query("SELECT name FROM department ORDER BY name ASC", (err, res) => {
    if (err) throw err;
		 // Log all results of the SELECT statement
		 console.table(res);   
		 start();
	
  });
};

const viewAllRoles = () => {
  connection.query("SELECT role.title AS job_title, department.name AS department_name, role.salary FROM role LEFT JOIN department ON role.department_id=department.id", (err, res) => {
    if (err) throw err;
		 // Log all results of the SELECT statement
		 console.table(res);   
		 start();
	
  });
};


