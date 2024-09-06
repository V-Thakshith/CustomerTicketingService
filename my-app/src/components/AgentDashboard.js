import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentDashboard.css';
import api from '../api'; // Ensure this is correctly configured for your API
import { UserContext } from "../UserContext";

// Main Dashboard Component
const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { user, ready } = useContext(UserContext);
  const navigate = useNavigate();

  // Define category order
  const categoryOrder = {
    'Technical': 1,
    'Billing': 2,
    'General': 3,
    'Product': 4,
    'All': 5
  };

  // Define categories
  const categories = ['All', 'Technical', 'Billing', 'General', 'Product'];

  useEffect(() => {
    // Fetch tickets and sort them by category
    if (!ready) return;

    if (!user) {
      navigate('/');
      return;
    }

    setLoading(true);
    setError(null);
    const fetchTickets = async () => {
      try {
        const response = await api.get(`/tickets/assigned/${user._id}`); // Adjust endpoint as needed
        const sortedTickets = response.data.sort((a, b) => {
          if (a.category === b.category) return 0;
          return (categoryOrder[a.category] || 999) - (categoryOrder[b.category] || 999);
        });
        setTickets(sortedTickets);
      } catch (error) {
        setError('Error fetching tickets.');
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, ready, navigate]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesCategory = selectedCategory === 'All' || ticket.category === selectedCategory;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
            <button
              type="button"
              className="profile-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Agent Profile
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <a href="#sign-out" className="dropdown-item">Sign Out</a>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar-container">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search tickets"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="search-button">Search</button>
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="dropdown-container">
          <label htmlFor="category-select">Filter by Category:</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="category-dropdown"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* All Tickets Section */}
        <div id="all-tickets" className="card">
          <div className="card-header">
            <h5>All Tickets</h5>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Ticket Number</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Subject</th>
                  <th scope="col">Category</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date Created</th>
                  <th scope="col">View Ticket</th> {/* New column */}
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map(ticket => (
                    <tr key={ticket._id}>
                      <td>{ticket._id}</td>
                      <td>{ticket.customer.name}</td>
                      <td>{ticket.title}</td>
                      <td>{ticket.category}</td>
                      <td>{ticket.status}</td>
                      <td>{ticket.createdAt}</td>
                      <td><a href={`#ticket-${ticket._id}`} className="view-link">View</a></td> {/* New view link */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No tickets available</td> {/* Handle no tickets case */}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
