import { useState } from 'react';
import './scss/mapper.css';

const Tracker = () => {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    debit: "",
    description: "",
    datetime: "",
    transactionType: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    console.log(JSON.stringify(form));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/userTransactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        console.log('Transaction data submitted successfully');
        alert('Successfully submitted')
      } else {
        console.error('Error submitting transaction data:', response.status);
        alert('There was an Error while submitting')
      }
    } catch (error) {
      console.error('Error submitting transaction data:', error);
    }
  };
  
  return (
    <>
      <div className="mainContainer">
        <h1>ExpanseMapper</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor='name'>Name: </label>
          <input type='text' id='name' name='name' placeholder='name' onChange={handleChange} required />

          <label htmlFor='amount'>Opening Balance: </label>
          <p>(prev day closing balance or total amount in bank currently)</p>
          <input type='number' id='amount' name='amount' placeholder='amount' onChange={handleChange} required />

          <label htmlFor='debit'>Debit: </label>
          <input type='text' id='debit' name='debit' placeholder='debit' onChange={handleChange} required />

          <label htmlFor='description'>Description: </label>
          <textarea id='description' name='description' placeholder='description' onChange={handleChange} required />
          <select
            id='transactionType'
            name='transactionType'
            onChange={handleChange}>
            <option value=''>Select Transaction Type</option>
            <option value='credit'>Credit</option>
            <option value='debit'>Debit</option>
          </select>

          <label htmlFor='datetime'>Date and Time: </label>
          <input type='datetime-local' id='datetime' name='datetime' placeholder='date & time' onChange={handleChange} required />

          <label htmlFor='closingbalance'>Closing balance: </label>
          <input type='number' id='closingbalance' name='closingbalance' placeholder='closingbalance' onChange={handleChange} required />

          <button type='submit'>Add Expense</button>
        </form>
      </div>
    </>
  );
};

export default Tracker;