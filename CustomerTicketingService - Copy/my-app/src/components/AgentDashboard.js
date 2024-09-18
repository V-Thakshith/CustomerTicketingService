import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AgentDashboard.css";
import api from "../api"; // Ensure this is correctly configured for your API
import { UserContext } from "../UserContext";
import TicketModal from "./TicketModal";
import TicketChart from "./TicketChart";

const AgentDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null); // New state for selected ticket
  const [showModal, setShowModal] = useState(false); // State to control the modal

  const { user, ready } = useContext(UserContext); // Use user from UserContext
  const navigate = useNavigate();

  const categoryOrder = {
    Technical: 1,
    Billing: 2,
    General: 3,
    Product: 4,
    All: 5,
  };

  const categories = ["All", "Technical", "Billing", "General", "Product"];

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      navigate("/");
      return;
    }

    fetchTickets();
  }, [user, ready, navigate]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/tickets/assigned/${user._id}`); // Adjust endpoint as needed
      const sortedTickets = response.data.sort((a, b) => {
        if (a.category === b.category) return 0;
        return (
          (categoryOrder[a.category] || 999) -
          (categoryOrder[b.category] || 999)
        );
      });
      setTickets(sortedTickets);
    } catch (error) {
      setError("Error fetching tickets.");
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    window.location.reload();
    fetchTickets();
    setShowModal(false);
    setSelectedTicket(null);
  };

  const handleTicketAction = (action) => {
    handleCloseModal(); // Close the modal after action
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesCategory =
      selectedCategory === "All" || ticket.category === selectedCategory;
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="sidebar-sticky">
          <ul className="nav-list">
            <li className="nav-item">
              <a className="nav-link" href="#my-tickets">
                My Tickets
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#all-tickets">
                All Tickets
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#customers">
                Customers
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#reports">
                Reports
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <div className="header">
          <h4>Agent Home Page</h4>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {user && (
          <div className="agent-stats">
            <h1>Agent: {user.name}</h1>
            <div id="ticket-count" className="card">
              <div className="card-header">
                <h5>Total Tickets:</h5>
              </div>
              <div className="card-body">
                <p> {user.ticketCount}</p>
              </div>
            </div>

            <div id="ticket-count" className="card">
              <div className="card-header">
                <h5>Open Tickets:</h5>
              </div>
              <div className="card-body">
                <p> {user.ticketOpen}</p>
              </div>
            </div>

            <div id="ticket-count" className="card">
              <div className="card-header">
                <h5>In Progress Tickets:</h5>
              </div>
              <div className="card-body">
                <p> {user.ticketInProgress}</p>
              </div>
            </div>

            <div id="ticket-count" className="card">
              <div className="card-header">
                <h5>Resolved Tickets:</h5>
              </div>
              <div className="card-body">
                <p> {user.ticketResolved}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search tickets"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="search-button">Search</button>
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
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
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
                  <th scope="col">View Ticket</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket._id}>
                      <td>{ticket._id}</td>
                      <td>{ticket.customer.name}</td>
                      <td>{ticket.title}</td>
                      <td>{ticket.category}</td>
                      <td>{ticket.status}</td>
                      <td>
                        {new Date(ticket.createdAt).toLocaleDateString("en-US")}
                      </td>
                      <td>
                        <button
                          className="view-link"
                          onClick={() => handleViewTicket(ticket)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No tickets available</td>
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
          {user && (
  <TicketChart 
    ticketCount={user.ticketCount} 
    ticketResolved={user.ticketResolved} 
    ticketInProgress={user.ticketInProgress} 
    ticketOpen={user.ticketOpen} 
  />
)}

          </div>
        </div>

        {showModal && (
          <TicketModal
            ticket={selectedTicket}
            onClose={handleCloseModal}
            onAction={handleTicketAction}
          />
        )}
      </main>
    </div>
  );
};

export default AgentDashboard;
