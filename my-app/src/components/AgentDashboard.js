import React, { useState } from 'react';
import './AgentDashboard.css';

// Component for Search Bar
const SearchBar = ({ placeholder }) => (
  <div className="search-bar">
    <input type="text" className="search-input" placeholder={placeholder} />
    <button className="search-button">Search</button>
  </div>
);

// Tickets Table Component
const TicketsTable = ({ tickets }) => (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Ticket Number</th>
            <th scope="col">Customer Name</th>
            <th scope="col">Subject</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col">Date Created</th>
            <th scope="col">View Ticket</th> {/* New column */}
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.number}>
              <td>{ticket.number}</td>
              <td>{ticket.customerName}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.priority}</td>
              <td>{ticket.status}</td>
              <td>{ticket.dateCreated}</td>
              <td><a href={`#ticket-${ticket.number}`} className="view-link">View</a></td> {/* New view link */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
// Component for Customer List
const CustomerList = ({ customers }) => (
  <div className="table-container">
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Tickets</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.name}>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{customer.phone}</td>
            <td>{customer.tickets}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Main Dashboard Component
const AgentDashboard = () => {
    const [showDropdown, setShowDropdown] = useState(false);
  const myTickets = [
    { number: 1, customerName: 'Herry', subject: 'Issue with Product', priority: 'High', status: 'Open', dateCreated: '2021-03-24' },
  ];

  const allTickets = [
    { number: 1, customerName: 'John Doe', subject: 'Issue with Payment', priority: 'High', status: 'In Progress', dateCreated: '2021-10-01' },
    { number: 2, customerName: 'Alex', subject: 'Issue with Service', priority: 'Low', status: 'Closed', dateCreated: '2020-12-03' },
  ];

  const customers = [
    { name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', tickets: 5 },
    { name: 'Erric Nam', email: 'erric.nam@example.com', phone: '112-233-4455', tickets: 2 },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-sticky">
          <ul className="nav-list">
            <li className="nav-item">
              <a className="nav-link" href="#my-tickets">My Tickets</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#all-tickets">All Tickets</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#customers">Customers</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#reports">Reports</a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <div className="header">
          <h4>Agent Home Page</h4>
          <div className="btn-toolbar">
            <button type="button" className="profile-button">Agent Profile</button>
            {showDropdown && (
                <div className="dropdown-menu">
                  <a href="#sign-out" className="dropdown-item">Sign Out</a>
                </div>
              )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar-container">
          <SearchBar placeholder="Search customers" />
        </div>

        {/* My Tickets Section */}
        <div id="my-tickets" className="card">
          <div className="card-header">
            <h5>My Tickets</h5>
          </div>
          <TicketsTable tickets={myTickets} />
        </div>

        {/* All Tickets Section */}
        <div id="all-tickets" className="card">
          <div className="card-header">
            <h5>All Tickets</h5>
          </div>
          <TicketsTable tickets={allTickets} />
        </div>

        {/* Customers Section */}
        <div id="customers" className="card">
          <div className="card-header">
            <h5>Customers</h5>
          </div>
          <CustomerList customers={customers} />
        </div>

        {/* Reports Section */}
        <div id="reports" className="card">
          <div className="card-header">
            <h5>Reports</h5>
          </div>
          <div className="card-body">
            <p>No reports available</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;
