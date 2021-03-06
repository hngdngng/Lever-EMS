const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "leverDB"
});

// Connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("LeverDB connected");
    start();
});

// Starter function
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees/Role/Department",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit"
            ]
        })
        .then(answer => {
            switch (answer.action) {
                case "View all Departments":
                    viewAllDep();
                    break;
                case "View all Roles":
                    viewAllRol();
                    break;
                case "View all Employees/Role/Department":
                    viewAllEmp();
                    break;
                case "Add Department":
                    addDep();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmp();
                    break;
                case "Update Employee Role":
                    updateEmpRole();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}
// ------ PRIMARY FUNCTIONS REFERENCED IN SWITCH CASES ------
// View all Departments
function viewAllDep() {
    console.log("retrieving departments from database");
    connection.query("SELECT * from department", (err, result) => {
        if (err) throw err;
        console.table(result);
        start();
    });
}

// View all Roles
function viewAllRol() {
    console.log("retrieving roles from database");
    connection.query("SELECT role.id, role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id", (err, result) => {
        if (err) throw err;
        console.table(result);
        start();
    });
}

// View All Employees with their role and department
function viewAllEmp() {
    console.log("retrieving employees from database");
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id";
    connection.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);
        start();
    });
}

// Add a New Department
function addDep() {
    inquirer
        .prompt({
            name: "dep_name",
            type: "input",
            message: "What is the department name?"
        })
        .then(answer => {
            connection.query("INSERT INTO department (name) VALUES (?)", answer.dep_name, (err, result) => {
                if (err) throw err;
            });
            console.log("Added department to database");
            start();
        });
}

// Add a New Role
function addRole() {
    const departments = [];
    connection.query("SELECT name FROM department", (err, result) => {
        if (err) throw err;
        result.forEach(dep => {
            departments.push(dep.name);
        });
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the role title?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the role salary?"
                },
                {
                    name: "department",
                    type: "list",
                    message: "What is the role department?",
                    choices: departments
                }
            ])
            .then(answer => {
                getDepId(answer);
            });
    });
}

// Add an New Employee
function addEmp() {
    const roles = [];
    const managers = [];
    connection.query("SELECT title FROM role", (err, result) => {
        if (err) throw err;
        result.forEach(role => {
            roles.push(role.title);
        });
        connection.query("SELECT CONCAT(first_name, ' ' ,last_name) AS name FROM employee WHERE manager_id is NULL", (err2, result2) => {
            if (err2) throw err2;
            result2.forEach(employee => {
                managers.push(employee.name);
            });
            managers.push('none');
            inquirer
                .prompt([
                    {
                        name: "fname",
                        type: "input",
                        message: "What is the employee's first name?"
                    },
                    {
                        name: "lname",
                        type: "input",
                        message: "What is the employee's last name?"
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is the employee's role?",
                        choices: roles
                    },
                    {
                        name: "manager",
                        type: "list",
                        message: "Who is the employee's manager?",
                        choices: managers
                    }
                ])
                .then(answer => {
                    console.log(answer)
                    getRolId(answer)
                })
        });

    });
}

//Update an Employee
function updateEmpRole() {
    const employees = [];
    const roles = [];
    connection.query("SELECT CONCAT(first_name, ' ' ,last_name) AS name FROM employee", (err, result) => {
        if (err) throw err;
        result.forEach(emp => {
            employees.push(emp.name);
        });
        connection.query("SELECT title FROM role", (err2, result2) => {
            if (err2) throw err2;
            result2.forEach(role => {
                roles.push(role.title)
            });
            inquirer
                .prompt([
                    {
                        name: "employee",
                        type: "list",
                        message: "Who is the employee you want to update?",
                        choices: employees
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "What is their new role?",
                        choices: roles
                    }
                ])
                .then(answer => {
                    updateEmp(answer);
                })
        });
    });
}

// ------ SECONDARY FUNCTIONS ------
// Get id of user's chosen department
function getDepId(answer) {
    let dept_id;
    connection.query("SELECT id FROM department WHERE name = ?", answer.department, (err, result) => {
        if (err) throw err;
        dept_id = result[0].id;
        insertRole(answer, dept_id);
    });
}

//Insert new role to database
function insertRole(answer, id) {
    connection.query("INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [answer.title, parseInt(answer.salary), id], (err, result) => {
        if (err) throw err;
        console.log("Added role to database");
        start();
    })
}

// Insert new employee to database
function insertEmployee(answer, role_id, mgr_id) {
    connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [answer.fname.trim(), answer.lname.trim(), role_id, mgr_id], (err, result) => {
        if (err) throw err;
        start();
    });
}

// Get id of manager chosen
function getMgrId(answer, role_id) {
    let mgr_id;
    if (answer.manager != "none") {
        const mgr = answer.manager.split(" ");
        const fname = mgr[0];
        const lname = mgr[1];
        connection.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?;", [fname, lname], (err, result) => {
            if (err) throw err;
            mgr_id = result[0].id;
            insertEmployee(answer, role_id, mgr_id)
        });
    } else {
        insertEmployee(answer, role_id, mgr_id)
    }
}

// Get id of role
function getRolId(answer) {
    let role_id;
    connection.query("SELECT id FROM role WHERE title = ?;", answer.role, (err, result) => {
        if (err) throw err;
        role_id = result[0].id;
        getMgrId(answer, role_id);
    });
}

// Update Employee values
function updateEmp(answer) {
    let role_id;
    const emp = answer.employee.split(" ");
    const fname = emp[0];
    const lname = emp[1];
    connection.query("SELECT id FROM role WHERE title = ?;", answer.role, (err, result) => {
        if (err) throw err;
        role_id = result[0].id;
        connection.query("UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?", [role_id, fname, lname], (err2, result2) => {
            if (err2) throw err2;
            start();
        });
    });
}