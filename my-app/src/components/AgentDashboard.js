import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentDashboard.css';
import api from '../api'; // Ensure this is correctly configured for your API
import { UserContext } from "../UserContext";

// Main Dashboard Component
const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { user, setUser, ready } = useContext(UserContext);
  const navigate = useNavigate();

  const priorities = ['All', 'High', 'Medium', 'Low'];

  useEffect(() => {
    // Fetch tickets and sort them by priority
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
          const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3, 'All': 4 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
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

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesPriority = selectedPriority === 'All' || ticket.priority === selectedPriority;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesSearch;
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

        {/* Priority Dropdown */}
        <div className="dropdown-container">
          <label htmlFor="priority-select">Filter by Priority:</label>
          <select
            id="priority-select"
            value={selectedPriority}
            onChange={handlePriorityChange}
            className="priority-dropdown"
          >
            {priorities.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
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
                  <th scope="col">Priority</th>
                  <th scope="col">Status</th>
                  <th scope="col">Date Created</th>
                  <th scope="col">View Ticket</th> {/* New column */}
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(ticket => (
                  <tr key={ticket._id}>
                    <td>{ticket._id}</td>
                    <td>{ticket.customer.name}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.priority}</td>
                    <td>{ticket.status}</td>
                    <td>{ticket.createdAt}</td>
                    <td><a href={`#ticket-${ticket._id}`} className="view-link">View</a></td> {/* New view link */}
                  </tr>
                ))}
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
