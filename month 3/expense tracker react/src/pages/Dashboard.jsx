// Dashboard.js

import { useEffect, useState } from 'react';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/getUserInformation?type=status', { withCredentials: true }, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.isLoggedIn) {
          // User is logged in, fetch and display transactions
          displayTransactions();
        } else {
          // User is not logged in, prompt to log in
          alert(data.error || 'Please log in to view transactions.');
        }
      } else {
        // Handle non-OK responses (e.g., server errors)
        console.error('Server error:', data.error || response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const displayTransactions = async () => {
    try {
      const response = await fetch('/api/displayTransactions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(data);
      } else {
        // Display an error message
        alert(data.error || 'Error fetching transactions.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>User Transactions</h1>
      {transactions.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Debit</th>
              <th>Description</th>
              <th>Date</th>
              <th>Transaction Type</th>
              <th>Closing Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.Name}</td>
                <td>{transaction.Amount}</td>
                <td>{transaction.Debit}</td>
                <td>{transaction.Description}</td>
                <td>{transaction.Date}</td>
                <td>{transaction.TransactionType}</td>
                <td>{transaction.ClosingBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found for the user.</p>
      )}
    </div>
  );
}

export default Dashboard;
