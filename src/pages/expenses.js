import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { BsTrash } from "react-icons/bs";

export default function Expenses() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [expensesList, setExpensesList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [category, setCategory] = useState("");

  useEffect(() => {
    // 1. get the expensess from local storage
    const expenses = JSON.parse(localStorage.getItem("expenses"));
    // 2. check if there is a data in local storage or not
    if (expenses) {
      setExpensesList(expenses);
    }
  }, []);

  const addExpenses = () => {
    // 1. clone the list
    const newExpensesList = [...expensesList];

    // 2. make sure name & amount is not empty
    if (name && amount) {
      // 3. push new expenses
      newExpensesList.push({
        id: nanoid(),
        name: name,
        category: category,
        amount: parseInt(amount),
      });
      // 4. save into the local storage & set the new state for expensesList
      setExpensesList(newExpensesList);
      localStorage.setItem("expenses", JSON.stringify(newExpensesList));
      // 5. clear the fields
      setName("");
      setAmount(0);
    } else {
      alert("Please insert your expenses");
    }
  };

  const deleteExpenses = (id) => {
    // 1. filter the list
    const newExpensesList = expensesList.filter((i) => i.id !== id);
    // 2. update to local storage and set new state
    setExpensesList(newExpensesList);
    localStorage.setItem("expensess", JSON.stringify(newExpensesList));
  };

  const checkBoxAll = (event) => {
    if (event.target.checked) {
      // 1. clone the existing checked list
      const newCheckedList = [];
      expensesList.forEach((i) => {
        newCheckedList.push(i.id);
      });
      setCheckedList(newCheckedList);
      // set checkAll
      setCheckAll(true);
    } else {
      // reset the array
      setCheckedList([]);
      // unset checkall
      setCheckAll(false);
    }
  };

  const checkboxOne = (event, id) => {
    // if is checked
    if (event.target.checked) {
      // 1. clone existing checked list
      const newCheckedList = [...checkedList];
      // 2. push new id into the checked list
      newCheckedList.push(id);
      // 3. update the state
      setCheckedList(newCheckedList);
    } else {
      // 1. remove the id from the checked list
      const newCheckedList = checkedList.filter((i) => i !== id);
      // 2. update the state
      setCheckedList(newCheckedList);
    }
  };

  const deleteCheckedItems = () => {
    // 1. filter the list
    const newExpensesList = expensesList.filter((i) => {
      // make sure the id is in the checked list
      if (checkedList && checkedList.includes(i.id)) {
        return false;
      }
      return true;
    });
    // 2. update to local storage and set new state
    setExpensesList(newExpensesList);
    localStorage.setItem("expensess", JSON.stringify(newExpensesList));
  };

  const calculateTotal = () => {
    let total = 0;
    expensesList.forEach((i) => {
      total += parseInt(i.amount);
    });
    return total;
  };

  return (
    <div
      className="container mt-5 mx-auto"
      style={{
        maxWidth: "800px",
      }}
    >
      <Card>
        <Card.Body>
          <Card.Title>expenses</Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    checked={checkAll}
                    disabled={
                      expensesList && expensesList.length > 0 ? false : true
                    }
                    onChange={(event) => {
                      checkBoxAll(event);
                    }}
                  />
                </th>
                <th>Source</th>
                <th>Category</th>
                <th>Amount</th>
                <th>
                  Actions
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2"
                    disabled={
                      checkedList && checkedList.length > 0 ? false : true
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      deleteCheckedItems();
                    }}
                  >
                    <BsTrash />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {expensesList.length > 0 ? (
                expensesList.map((i) => {
                  return (
                    <tr key={i.id}>
                      <td className="mb-3">
                        <Form.Check
                          checked={
                            checkedList && checkedList.includes(i.id)
                              ? true
                              : false
                          }
                          type="checkbox"
                          onChange={(event) => {
                            checkboxOne(event, i.id);
                          }}
                        />
                      </td>
                      <td className="mb-3">{i.name}</td>
                      <td className="mb-3">{i.category}</td>

                      <td className="mb-3">${i.amount}</td>

                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={
                            checkedList && checkedList.includes(i.id)
                              ? false
                              : true
                          }
                          onClick={(event) => {
                            event.preventDefault();
                            deleteExpenses(i.id);
                          }}
                        >
                          <BsTrash />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>No expenses added yet.</td>
                </tr>
              )}
              <tr>
                <td>Total</td>
                <td>${calculateTotal()}</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
          <Form>
            <Form.Group className="mb-1 mt-2">
              <Form.Control
                type="text"
                placeholder="Type your expenses here..."
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <td className="mb-3">
                <select
                  className="form-control"
                  id="category"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                  }}
                >
                  <option value="">Select an category</option>
                  <option value="Food And Drink">Food & Drink</option>
                  <option value="Transport">Transport</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Housing">Housing</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </td>
            </Form.Group>
            <Form.Group className="mb-1">
              <Form.Control
                type="number"
                placeholder="Type your amount here..."
                value={amount}
                min={0}
                onChange={(event) => setAmount(event.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              size="sm"
              onClick={(event) => {
                event.preventDefault();
                addExpenses();
              }}
            >
              Add New
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Link to="/" className="pt-2 text-center">
        Go back to Dashboard
      </Link>
    </div>
  );
}
