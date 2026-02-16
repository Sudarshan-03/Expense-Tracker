import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

// Simple Toast Component
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50 flex items-center animate-bounce">
      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
      </svg>
      {message}
    </div>
  );
};

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortDateDesc, setSortDateDesc] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      // Build query string based on state
      let url = 'http://localhost:3000/expenses';
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (sortDateDesc) params.append('sort', 'date_desc');

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const response = await axios.get(url);
      setExpenses(response.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters/sort change
  useEffect(() => {
    fetchExpenses();
  }, [filterCategory, sortDateDesc]);

  // Calculate total amount of VISIBLE expenses
  const totalAmountInCents = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalAmountFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalAmountInCents / 100);

  // Calculate Top 3 Categories Logic
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, 3)
    .map(([category, amount]) => ({
      category,
      amount: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100)
    }));


  const handleExpenseAdded = () => {
    fetchExpenses();
    setToastMessage("✅ Expense added successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Expense Tracker</h1>
          <p className="text-gray-600">Manage your spending with precision</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
          </div>
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
              <div className="flex-grow flex flex-col justify-center items-center mb-6">
                <h3 className="text-gray-500 font-medium text-lg mb-2">Total Expenses</h3>
                <p className="text-4xl font-bold text-blue-600">{totalAmountFormatted}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {filterCategory ? `in ${filterCategory}` : 'All Categories'}
                </p>
              </div>

              {/* Category Breakdown */}
              {topCategories.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Spending</h4>
                  <ul className="space-y-2">
                    {topCategories.map((item) => (
                      <li key={item.category} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.category}</span>
                        <span className="font-medium text-gray-800">{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading expenses...</p>
          </div>
        ) : (
          <ExpenseList
            expenses={expenses}
            filterCategory={filterCategory}
            sortDateDesc={sortDateDesc}
            onFilterChange={setFilterCategory}
            onSortChange={setSortDateDesc}
          />
        )}
      </div>
    </div>
  );
}

export default App;
