DROP DATABASE IF EXISTS employees_db;
CREATE database employees_db;

USE employees_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL UNIQUE,
  salary DECIMAL(6,0) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE set null
);


--FK: https://www.makeuseof.com/beginners-guide-to-writing-mysql-database-schemas/

-- Creates new rows containing data in all named columns --
-- Department table data
INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");

-- Role table data
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 190000, 4);

-- Employee table data
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("John", "Doe", 1, 102);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Mike", "Chan", 1, 100);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ashley", "Rodriguez", 2);
INSERT INTO employee (first_name, last_name, role_id,manager_id) VALUES ("Kevin", "Tupik", 2, 102);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Malia", "Brown", 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Sarah", "Lourd", 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Tom", "Allen", 4, 105);




SELECT * FROM department;
select * from role;
select * from employee;




