# Expense Tracker

A full-stack expense tracking application built with **React (Vite)** and **Node.js (Express)**. Manage your daily expenses with ease, visualize spending categories, and filter your history.

## Features

-   **Add Expenses**: Quickly add expenses with amount, date, category, and description.
-   **View History**: See a list of all your expenses, sorted by date.
-   **Filtering & Sorting**: Filter expenses by category and toggle sort order (Newest/Oldest).
-   **Total & Insights**: Real-time calculation of total spending and a "Top Spending" category breakdown.
-   **Delete Expenses**: Remove unwanted entries with a single click.
-   **Data Persistence**: All data is stored in a local SQLite database.
-   **Robust API**: Backend handles input validation, idempotency (prevents duplicate submissions), and CORS.
-   **Responsive UI**: Modern, clean interface styled with Tailwind CSS v4.

## Tech Stack

-   **Frontend**: React.js, Vite, Tailwind CSS v4, Axios
-   **Backend**: Node.js, Express.js, SQLite3
-   **Tools**: Postman/Curl (for API testing), Git

## Prerequisites

-   Node.js (v14 or higher)
-   npm (Node Package Manager)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Expense-Tracker.git
cd Expense-Tracker
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Start the backend server:

```bash
node server.js
```

The server will run on `http://localhost:3000`. It will automatically create the `expense_tracker.db` SQLite database file.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd ../frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## API Endpoints

### `GET /expenses`
Retrieve a list of expenses.
-   **Query Params**:
    -   `category` (optional): Filter by category name (e.g., `Food`).
    -   `sort` (optional): Sort by date (`date_desc` for newest first).

### `POST /expenses`
Add a new expense.
-   **Headers**: `Idempotency-Key` (UUID) required for idempotency.
-   **Body**:
    ```json
    {
      "amount": 1234,        // Amount in cents (integer)
      "category": "Food",
      "description": "Lunch",
      "date": "2023-10-27T12:00"
    }
    ```

### `DELETE /expenses/:id`
Delete an expense by ID.
-   **Params**: `id` (UUID of the expense).

## Project Structure

```
expense-tracker/
├── backend/
│   ├── expense_tracker.db  # SQLite database
│   ├── package.json        # Backend dependencies
│   └── server.js           # API server entry point
├── frontend/
│   ├── src/
│   │   ├── components/     # React components (ExpenseForm, ExpenseList)
│   │   ├── App.jsx         # Main application logic
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind imports
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── README.md
```

## License

This project is open-source and available under the MIT License.
