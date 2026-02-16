import React from 'react';

const ExpenseList = ({ expenses, filterCategory, sortDateDesc, onFilterChange, onSortChange }) => {
    // Logic is handled in App.jsx for filtering/sorting to calculate total correctly there
    // But we can also do it here if passed distinct props.
    // Based on prompt: "Create a state for expenses (array) and filterCategory (string)." in App.jsx
    // "Calculate and display Total Amount"

    // So ExpenseList likely receives the *filtered* and *sorted* expenses or the raw list + controls.
    // Let's assume App.jsx passes the raw expenses and handles the logic, OR passes the processed list.
    // The prompt says: "Total Calculation: Create a variable totalAmount that sums the amount of the currently visible/filtered expenses."
    // This implies the calculation happens where the filtering happens.

    // Let's implement the UI parts here.

    const formatCurrency = (amountInCents) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amountInCents / 100);
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleDateString() + ' ' + new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">Expense History</h2>

                <div className="flex gap-4 items-center">
                    <select
                        value={filterCategory}
                        onChange={(e) => onFilterChange(e.target.value)}
                        className="p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                    </select>

                    <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={sortDateDesc}
                            onChange={(e) => onSortChange(e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="text-gray-700 text-sm">Sort Newest First</span>
                    </label>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {expenses.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                        </svg>
                                        <p className="text-lg font-medium">No expenses found.</p>
                                        <p className="text-sm">Add your first expense above!</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            expenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(expense.date)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {expense.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                        {formatCurrency(expense.amount)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseList;
