const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console-table");
// Enable access to .env variables
const dotenv = require("dotenv");

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
					
				case "viewAllDepartments":
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

        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

