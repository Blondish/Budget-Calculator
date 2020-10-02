import React from "react";
import "./App.css";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import Alert from "./components/Alert";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";

const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

function App() {
  // state set up
  const [expenses, setExpenses] = useState(initialExpenses);
  const [charge, setCharge] = useState("");
  const [amount, setAmount] = useState("");
  const [alert, setAlert] = useState({ show: false });

  //useEffect set up

  useEffect(() => {
    console.log("UseEffect");
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  //editing functionality
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);

  const handleCharge = (e) => {
    setCharge(e.target.value);
  };
  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let editedExpenses = expenses.map((expense) => {
          return expense.id === id ? { ...expense, charge, amount } : expense;
        });
        setExpenses(editedExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "expense edited" });
      } else {
        const newExpense = { id: uuidv4(), charge, amount };
        setExpenses([...expenses, newExpense]);
        handleAlert({ type: "success", text: "expense added" });
      }
      setCharge("");
      setAmount("");
    } else {
      handleAlert({
        type: "danger",
        text: "charge cannot be empty and/or amount cannot be below 0"
      });
    }
  };

  const clearExpenses = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "All Expenses Deleted" });
  };

  const handleDelete = (id) => {
    let filtered = expenses.filter((expense) => expense.id !== id);
    setExpenses(filtered);
    handleAlert({ type: "danger", text: "expense deleted" });
  };

  const handleEdit = (id) => {
    let editedExp = expenses.find((exp) => exp.id === id);
    let { charge, amount } = editedExp;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}

      <h1>Budget Calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          clearExpenses={clearExpenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </main>
      <h1>
        Total Spending:
        <span className="total">
          ${" "}
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
