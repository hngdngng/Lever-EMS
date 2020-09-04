-- Insert sample information into database for testing purposes
INSERT INTO department (name) VALUES ("Software Engineering");
INSERT INTO department (name) VALUES ("Marketing");


INSERT INTO role (title, salary, department_id) VALUES ("Lead Engineer", 140000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Junior developer", 75000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Product Manager", 85000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Senior Product Manager", 110000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jill", "Bates", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Perry", "Lage", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jenn", "Swift", 3, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Meryl", "Streep", 4, null);