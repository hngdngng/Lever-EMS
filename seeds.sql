-- Insert sample information into database for testing purposes
INSERT INTO department (name) VALUES ("Software Engineering");

INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer", 140000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Junior developer", 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jill", "Bates", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Perry", "Lage", 2, 1);