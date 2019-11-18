CREATE TABLE salaries (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(255),
  salary VARCHAR(255),
  monthlyTax VARCHAR(255)
);

INSERT INTO salaries (name, salary, monthlyTax)
  VALUES  ('john','9875','987.5');