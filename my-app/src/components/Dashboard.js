import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import api from '../api'; // Ensure this is correctly configured for your API
import { UserContext } from "../UserContext";

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, ready } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            if (!ready) return;

            if (!user) {
                navigate('/login');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await api.get(`/tickets/customer/${user._id}`);
                console.log('Tickets fetched:', response.data);
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
                setError('Error fetching tickets.');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [ready, user, navigate]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const filteredTickets = tickets.filter(ticket =>
        (statusFilter === '' || ticket.status === statusFilter) &&
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="dashboard-container">
            <header className="header">
                <div className="logo">TelecomCo</div>
                <nav className="nav-menu">
                    <a href="#home">Home</a>
                    <a href="#tickets">Tickets</a>
                    <a href="#reports">Reports</a>
                    <a href="#settings">Settings</a>
                </nav>
                <div className="profile-photo">
                    <img src="profile-photo-url" alt="Profile" />
                </div>
            </header>

            <main className="main-content">
                <div className="top-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <select
                        className="status-filter"
                        value={statusFilter}
                        onChange={handleStatusChange}
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <button className="raise-ticket-button">Raise Ticket</button>
                </div>
                <table className="info-table">
                    <thead>
                        <tr>
                            <th>Ticket No.</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map(ticket => (
                                <tr key={ticket._id}>
                                    <td>{ticket._id}</td>
                                    <td>{ticket.title}</td>
                                    <td>{ticket.status}</td>
                                    <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No tickets found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    );
};

export default Dashboard;
