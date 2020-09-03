const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Dududev21",
    database: "leverDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("LeverDB connected");
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all Departments",
                "View all Roles",
                "View all Employees",
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
                case "View all Employees":
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

function viewAllDep() {
    console.log("retrieving departments from database");
    connection.query("SELECT * from department", (err, result) => {
        if (err) throw err;
        console.table(result);
        start();
    });
}

function viewAllRol() {
    console.log("retrieving roles from database");
    connection.query("SELECT * from role", (err, result) => {
        if (err) throw err;
        console.table(result);
        start();
    });
}

function viewAllEmp() {
    console.log("retrieving employees from database");
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id";
    connection.query(query, (err, result) => {
        if (err) throw err;
        console.table(result);
        start();
    });
}

// function addDep() {
//     inquirer
//         .prompt({
//             name: "dep_name",
//             type: "input",
//             message: "What is the department name?"
//         })
//         .then(answer => {
//             connection.query("INSERT INTO department (name) VALUES (?)", answer.dep_name, (err, result) => {
//                 if (err) throw err;
//             })
//             console.log("Added department to database");
//             start();
//         });
// }

// function addRole() {
//     inquirer
//         .prompt([
//             {
//                 name: "title",
//                 type: "input",
//                 message: "What is the role title?"
//             },
//             {
//                 name: "salary",
//                 type: "input",
//                 message: "What is the role salary?"
//             },
//         ])
//         .then(answer => {
//             connection.query("INSERT INTO department (name) VALUES (?)", answer.dep_name, (err, result) => {
//                 if (err) throw err;
//             })
// //             console.log("Added role to database");
// //             start();
// //         });
// // }

// function addEmp() {
//     console.log("Added employee to database");
// }

// function updateEmpRole() {
//     console.log("Updating employee role database");
// }