const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { restoreDefaultPrompts } = require("inquirer");
const requiredQuestion = async (input) => {
  if (input === "") {
     return 'This question is required';
  }
  return true;
};
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

        // case "View All Employees By Manager":
        //   viewEmployeesByManager();
        //   break;

        case "Add Employee":
         addEmployee();
          break;

        // case "Remove Employee":
        //   removeEmployee();
        //   break; 
					
				// case "Update Employee":
				// 	updateEmployee();
				// 	break; 
				
				case "Update Employee Role":
					updateEmployeeRole();
					break;

				// case "Update Employee Manager":
				// 	updateEmployeeManager();
				// 	break;
				
				case "View All Roles":
					viewAllRoles();
					break;

				case "Add Role":
					addRole();
					break;
						
				// case "Remove Role":
				// 	removeRole();
				// 	break;
					
				case "View All Departments":
					viewAllDepartments();
					break;
					
				case "Add Department":
					addDepartment();
					break;
					
				// case "Update Department":
				// 	updateDepartment();
				// 	break;
					
				// case "Remove Department":
				// 	removeDepartment();
				// 	break;
				
				// case "Budget By Department":
				// 	budgetByDepartment();
				// 	break;

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


const viewEmployeesByDepartment = () => {
		const query = "";
		connection.query(query, (err, res) => {
			if (err) throw err;
			// Log all results of the SELECT statement
			console.table(res);   
			start();	
		});
};

const viewAllDepartments = () => {
  connection.query("SELECT name AS department_name FROM department ORDER BY name ASC", (err, res) => {
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


const addEmployee = () => {
  const employeeDBQuery = "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, department.name, role.salary, employee.manager_id FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id";
  connection.query(employeeDBQuery, (err, res) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the employee's first name?"
      }, {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      }, {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: res.map(role => {
          return { name: role.title, value: role.role_id }
        })
      }, {
        type: "input",
        name: "managerId",
        message: "Who is the employee's manager?"
      }])
      .then(answer => {
        console.log(answer);
        connection.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
          [answer.first_name, answer.last_name, answer.role, answer.managerId],
          function (err) {
            if (err) throw err
            console.log(`${answer.first_name} ${answer.last_name} added as a new employee`)
            start();
          })
      })
  })
}

const addDepartment = () => {

}

const addRole = () => {
    inquirer
    .prompt({
      type: 'input',
      name: 'new_role',
      message: 'What new role would you like to add?',
    }, {
      type: 'input',
      name: 'salary',
      message: 'What is the salary for this position?',
    }, {
    })
    .then((answer) => {

      console.log('Adding a new role...\n');
      const query = connection.query(
        'INSERT INTO role SET ?',
        { // This is the SET
          title: answer.title,
          salary: answer.salary,
          department_id: department.id,//not working
        },
        (err, res) => {
          if (err) throw err;
          console.log(err);
        }
      );

    });

}


