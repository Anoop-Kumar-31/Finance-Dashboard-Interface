# Zorvyn Assessment - Modern Finance Dashboard

A clean, interactive, and high-performance finance dashboard built to track transactions, visualize spending patterns, and manage financial health.

## 🚀 Implemented Features
- [✔] **Dashboard Overview**: Summary cards (Balance, Income, Expenses) with dynamic trends.
- [✔] **Data Visualization**: Time-based Cash Flow (Area Chart) and Categorical Spending Breakdown.
- [✔] **Smart Insights**: Automated savings rate calculation and top spending categories identified.
- [✔] **Transactions Management**: Full list with search, category filtering, and type filtering.
- [✔] **Modular Architecture**: Extracted complex table logic into reusable components.
- [✔] **Role-Based UI**: Simulated RBAC (Admin vs. Viewer) with restricted actions.
- [✔] **Dark Mode**: Premium class-based dark mode with system preference detection.
- [✔] **Data Persistence**: LocalStorage integration for cross-session state retention.
- [✔] **Export System**: Capability to export transactions to CSV and JSON formats.
- [✔] **Responsive Design**: Fully optimized for Mobile, Tablet, and Desktop.

## 🛠️ Tech Stack
| Technology | Badge | Usage |
| :--- | :--- | :--- |
| **React 19** | ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) | Core UI Framework |
| **Redux Toolkit** | ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) | State Management & Persistence |
| **Tailwind CSS v4** | ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) | Modern Utility-First Styling |
| **Framer Motion** | ![Framer](https://img.shields.io/badge/Framer-0055FF?style=for-the-badge&logo=framer&logoColor=white) | Fluid Animations & Transitions |
| **Recharts** | ![Recharts](https://img.shields.io/badge/Recharts-22c55e?style=for-the-badge) | Data Visualization & Charts |
| **Lucide React** | ![Lucide](https://img.shields.io/badge/Lucide-black?style=for-the-badge&logo=lucide) | Premium Iconography |
| **Vite** | ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) | Lightning-fast Build Tooling |

---

## 📊 Data Management & Mock Data
### Format & Location
All data is stored as static JSON files in the `public/` directory to simulate a real API response:
- **Transactions**: `public/mockData/transactions.json`
- **User/Roles**: `public/mockData/user.json`

### How it's Called
We use a custom React hook `useTransactions` located in `src/hooks/useTransactions.js`. On the first application load, it performs a native `fetch()` call to these JSON endpoints and populates the Redux store. 

#### State Persistence Logic
To handle cross-session data without a database:
```javascript
// src/store/store.js
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("zorvyn-store", JSON.stringify({
    transactions: state.transactions,
    user: state.user
  }));
});
```

> [!NOTE] 
> Since we use a custom persistence layer in `src/store/store.js`, the fetch only occurs if the Redux store is empty, optimizing performance and simulating a real-world cache.

---

## 🌓 Dark Mode Implementation
The application uses a **class-based** dark mode system powered by **Tailwind CSS v4**.
- **Detection**: On load, the app checks `localStorage` for a user preference. If none exists, it defaults to the system's color scheme (Media Query).
- **Toggling**: Handled in `Layout.jsx`, it applies the `.dark` class to the root `<html>` element.

```css
/* src/styles/index.css */
@theme {
  @variant dark (&:where(.dark, .dark *));
}
```

---

## 🧩 Component Architecture: The Transaction Table
To keep the code clean and maintainable, I extracted the transaction rendering logic into a standalone component: `src/components/ui/TransactionTable.jsx`.
- **Usage**: It is called inside `Transactions.jsx` with transactions and role-based permissions passed as props.
- **Dual View**: This single component intelligently switches between a **Desktop Table** and a **Mobile Card List** using Tailwind's responsive breakpoints:

```jsx
{/* Desktop View */}
<div className="hidden md:block">
  <table className="w-full">...</table>
</div>

{/* Mobile View */}
<div className="md:hidden space-y-3">
  {transactions.map(txn => <Card key={txn.id}>...</Card>)}
</div>
```

---

## 📱 Mobile Responsiveness
The dashboard is designed with a **Mobile-First** approach. 
- **Layout**: Sidebar collapses into a hamburger menu on smaller screens.
- **Grids**: Dashboard cards and charts stack vertically on mobile and expand to 2-3 columns on desktop.
- **Scroll Management**: Implemented a `ScrollToTop` logic in `Layout.jsx` that resets the content area whenever you change routes, preventing the "scrolled-down" bug when switching pages.

---

## 🔐 Role-Based Access Control (RBAC)
We simulate user roles to demonstrate UI adaptation:
- **Viewer**: Read-only access. Cannot add, edit, or delete transactions. UI notices clearly state the restricted status.
- **Super Admin**: Full control. Can manage all transactions.

### How to Switch Roles
Go to the **Login Page** where sample accounts are provided at the bottom. Clicking these entries will log you in with the respective role defined in `user.json`.
```json
[
  {
    "id": "user_001",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "permissions": [
      "read",
      "create",
      "update",
      "delete"
    ]
  },
  {
    "id": "user_002",
    "name": "Viewer User",
    "email": "viewer@example.com",
    "role": "viewer",
    "permissions": [
      "read"
    ]
  }
]
```
This is format we have taken the mock data for the user roles.

- In a real-world scenario, these permissions would be embedded in a JWT token or fetched from an `/auth/me` endpoint. Our simulation uses the `role` field from the mock data to toggle component visibility and backend-action triggers.

---

## 📥 Export Functionality
Users can take their data on the go using the export tools in the Transactions page:
- **CSV Export**: Uses `papaparse` to convert JSON state into a downloadable spreadsheet file.
- **JSON Export**: Allows users to download a raw backup of their filtered transaction list.

---

## 🔔 Notifications Hack
To see the notifications system in action, please follow these steps:
1. Open `src/components/layout/Header.jsx`.
2. Locate line **15-17**.
3. **Uncomment** the objects inside the `notifications` array as shown below:

```javascript
// src/components/layout/Header.jsx (Line 15)
const notifications = [
  { id: 1, title: "Salary Credited", message: "Your salary for March has been credited.", type: "income", time: "2h ago", icon: DollarSign },
  { id: 2, title: "Budget Alert", message: "You've spent 80% of your Food budget.", type: "alert", time: "5h ago", icon: AlertCircle },
  { id: 3, title: "Security Login", message: "New login detected from Mumbai, IN.", type: "info", time: "1d ago", icon: Info },
];
```

## Easter Egg 🥚
- Z logo on sidebar has animation on hover.\

---

### -Anoop Kumar