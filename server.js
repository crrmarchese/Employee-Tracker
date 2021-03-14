const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const requiredQuestion = async (input) => {
  if (input === "") {
     return 'This question is required';
  }
  return true;
};
// Enable access to .env variables
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.DB_USER,

  // Your password
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
   // run the start function after the connection is made to prompt the user
   start();
});

const start = () => {
  inquirer
    .prompt([
      {
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Exit",      
      ],
    },
  ])
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;

        case "Add Employee":
         addEmployee();
          break;

				case "Update Employee Role":
					updateEmployeeRole();
					break;
				
				case "View All Roles":
					viewAllRoles();
					break;

				case "Add Role":
					addRole();
					break;
									
				case "View All Departments":
					viewAllDepartments();
					break;
					
				case "Add Department":
					addDepartment();
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
      }, 
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?"
      }, 
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: res.map(role => {
          return { name: role.title, value: role.role_id }
        })
      }, 
      {
        type: "input",
        name: "managerId",
        message: "Who is the employee's manager?"
      },
    ])
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
  console.log("Adding a new department...\n");

  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    inquirer
    .prompt([
      {
        type: "input",
        name: "new_department",
        message: "What new department would you like to add?",
      },
    ])
    .then((answer) => {
      const query = "INSERT INTO department (name) VALUES (?)";
      connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(`${answer.new_department} added as new department`)
        start();
      });
    });
  });
}



const addRole = () => { 
 
  console.log("Adding a new role...\n");
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err
    inquirer
      .prompt([
        {
          type: "input",
          name: "new_role",
          message: "What new role would you like to add?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for this position?",
        }, 
        {
          type: "number",
          name: "deptId",
          message: "What is the department ID for this role?",
        },
      ])
      .then((answer) => {
        
        connection.query(
          'INSERT INTO role SET ?',
          { // This is the SET
            title: answer.new_role,
            salary: answer.salary,
            department_id: answer.deptId,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`The role of: ${answer.new_role} was created`);
            start();
          }
        );
  
      });


  })

}

const updateEmployeeRole = () => {

  console.log('Updating employee role...\n');
  
  const query ="SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.title, department.name, role.salary, employee.manager_id FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id";
  connection.query(query, (err, res) => {
    if (err) throw err
    inquirer
      .prompt([
        {
          type: "input",
          name: "role_id",
          message: "Which employee's role id would you like to update?",
      },
    
    ])
    .then((answer) => {

      connection.query(
        "UPDATE employee INNER JOIN role ON employees.role_id = role.id SET role.id = ? WHERE employee.id = ?",
        { // This is the SET
          role: answer.role_id,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`The role of: ${answer.role_id} was updated`);
          start();
        }
      );
    
    })  
   
  });

}


