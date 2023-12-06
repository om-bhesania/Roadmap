import { useState } from 'react';
import './scss/mapper.css';

// ... (Previous imports remain unchanged)

const DashboardTest = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    filter: '',
    filterInput: '',
    transactionType: '',
  });

  const [fetchedTransactions, setFetchedTransactions] = useState([]);
  const [totalAmountInBank, setTotalAmountInBank] = useState(0);

  const handleChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value,
    });
  };

  const handleShowAll = async () => {
    try {
      if (!searchCriteria.name) {
        alert('Name is required for "Show All"');
        return;
      }

      let apiUrl = `http://localhost:3001/api/fetchAllTransactions/${searchCriteria.name}`;

      // If filter is selected, add it to the API URL
      if (searchCriteria.filter) {
        apiUrl += `?filter=${searchCriteria.filter}`;

        // If date is selected, add date to the API URL
        if (searchCriteria.filter === 'date' && searchCriteria.filterInput) {
          apiUrl += `&date=${searchCriteria.filterInput}`;
        }

        // If transaction type is selected, add transaction type to the API URL
        if (searchCriteria.filter === 'transactionType' && searchCriteria.transactionType) {
          apiUrl += `&transactionType=${searchCriteria.transactionType}`;
        }
      }

      const response = await fetch(apiUrl);

      if (response.ok) {
        const transactions = await response.json();
        setFetchedTransactions(transactions);
        updateTotalAmountInBank(transactions);
        console.log('Filtered transactions:', transactions);
      } else {
        console.error('Error fetching transactions:', response.status);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleApplyFilters = async () => {
    try {
      // Log the current searchCriteria before making the API call
      console.log('Applying Filters. Current Search Criteria:', searchCriteria);

      // Use the same logic as handleShowAll here if needed
      await handleShowAll();
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const updateTotalAmountInBank = (transactions) => {
    let totalAmount = 0;

    transactions.forEach((transaction) => {
      if (transaction.transactionType === 'credit') {
        totalAmount += transaction.amount;
      } else if (transaction.transactionType === 'debit') {
        totalAmount -= transaction.amount;
      }
    });

    setTotalAmountInBank(totalAmount);
  };

  return (
    <>
      <h1>Dashboard</h1>
      <div className='mainContainer'>
        <form>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id='name'
            placeholder='Enter name'
            value={searchCriteria.name}
            onChange={handleChange}
          />

          <label htmlFor="filter">Filter By:</label>
          <select
            name="filter"
            id="filter"
            value={searchCriteria.filter}
            onChange={handleChange}
          >
            <option value="">Select Filter</option>
            <option value="date">Date</option>
            <option value="transactionType">Transaction Type</option>
            {/* Add other filter options here */}
          </select>

          {searchCriteria.filter && (
            <>
              {searchCriteria.filter === 'date' && (
                <input
                  type='date'
                  name='filterInput'
                  placeholder='Select Date'
                  value={searchCriteria.filterInput}
                  onChange={handleChange}
                />
              )}

              {searchCriteria.filter === 'transactionType' && (
                <select
                  name="transactionType"
                  id="transactionType"
                  value={searchCriteria.transactionType}
                  onChange={handleChange}
                >
                  <option value="">Select Transaction Type</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              )}
              {/* Add other filter input options here based on filter type */}
            </>
          )}

          <button type='button' onClick={handleShowAll}>Show All for Name</button>
          <button type='button' onClick={handleApplyFilters}>Apply Filters</button>
        </form>

        <div>
          <h2>Fetched Transactions:</h2>
          <ul>
            {fetchedTransactions.map((transaction) => (
              <li key={transaction._id}>
                {`
                Name: ${transaction.name}, 
                Opening-Balance: ${transaction.amount}, 
                Description: ${transaction.description}, 
                Date: ${transaction.datetime}, 
                Transaction-Type: ${transaction.transactionType},
                Closing-Balance: ${transaction.closingbalance},  
                `}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Total Amount in Bank:</h2>
          <p>{totalAmountInBank}</p>
        </div>
      </div>
    </>
  );
};

export default DashboardTest;

