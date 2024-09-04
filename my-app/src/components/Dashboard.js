// import React, { useState } from 'react';
// import './Dashboard.css';

// const Dashboard = () => {
//     // Mock data for the table
//     const initialData = [
//         { ticketNo: '001', subject: 'Internet Issue', status: 'To-Do', date: '2024-09-01' },
//         { ticketNo: '002', subject: 'Billing Error', status: 'In-Progress', date: '2024-08-30' },
//         { ticketNo: '003', subject: 'Service Outage', status: 'Closed', date: '2024-08-15' },
//     ];

//     // Initialize state with mock data
//     const [tickets] = useState(initialData);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [statusFilter, setStatusFilter] = useState('');

//     // Handle changes in the search input
//     const handleSearchChange = (e) => {
//         setSearchQuery(e.target.value);
//     };

//     // Handle changes in the status filter dropdown
//     const handleStatusChange = (e) => {
//         setStatusFilter(e.target.value);
//     };

//     // Filter tickets based on search query and status filter
//     const filteredTickets = tickets.filter(ticket => 
//         (statusFilter === '' || ticket.status === statusFilter) &&
//         ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className="dashboard-container">
//             <header className="header">
//                 <div className="logo">TelecomCo</div>
//                 <nav className="nav-menu">
//                     <a href="#home">Home</a>
//                     <a href="#tickets">Tickets</a>
//                     <a href="#reports">Reports</a>
//                     <a href="#settings">Settings</a>
//                 </nav>
//                 <div className="profile-photo">
//                     <img src="profile-photo-url" alt="Profile" />
//                 </div>
//             </header>

//             <main className="main-content">
//                 <div className="top-bar">
//                     <input 
//                         type="text" 
//                         placeholder="Search..." 
//                         className="search-bar" 
//                         value={searchQuery} 
//                         onChange={handleSearchChange} 
//                     />
//                     <select 
//                         className="status-filter"
//                         value={statusFilter} 
//                         onChange={handleStatusChange}
//                     >
//                         <option value="">All Statuses</option>
//                         <option value="To-Do">To-Do</option>
//                         <option value="In-Progress">In-Progress</option>
//                         <option value="Closed">Closed</option>
//                     </select>
//                     <button className="raise-ticket-button">Raise Ticket</button>
//                 </div>
//                 <table className="info-table">
//                     <thead>
//                         <tr>
//                             <th>Ticket No.</th>
//                             <th>Subject</th>
//                             <th>Status</th>
//                             <th>Date</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredTickets.length > 0 ? (
//                             filteredTickets.map(ticket => (
//                                 <tr key={ticket.ticketNo}>
//                                     <td>{ticket.ticketNo}</td>
//                                     <td>{ticket.subject}</td>
//                                     <td>{ticket.status}</td>
//                                     <td>{ticket.date}</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="4">No tickets found.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </main>
//         </div>
//     );
// };

// export default Dashboard;







import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    // Mock data for the table
    const initialData = [
        { ticketNo: '001', subject: 'Internet Issue', status: 'To-Do', date: '2024-09-01' },
        { ticketNo: '002', subject: 'Billing Error', status: 'In-Progress', date: '2024-08-30' },
        { ticketNo: '003', subject: 'Service Outage', status: 'Closed', date: '2024-08-15' },
    ];

    // Initialize state with mock data
    const [tickets,setTickets] = useState(initialData);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleTicketChange=(e)=>{
        setTickets(e.target.value)
    }

    // Handle changes in the search input
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle changes in the status filter dropdown
    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // Filter tickets based on search query and status filter
    const filteredTickets = tickets.filter(ticket => 
        (statusFilter === '' || ticket.status === statusFilter) &&
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                        <option value="To-Do">To-Do</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <button className="raise-ticket-button">Raise Ticket</button>
                </div>
                <table className="info-table">
                    <thead>
                        <tr>
                            <th>Ticket No.</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map(ticket => (
                                <tr key={ticket.ticketNo}>
                                    <td>{ticket.ticketNo}</td>
                                    <td>{ticket.subject}</td>
                                    <td>{ticket.status}</td>
                                    <td>{ticket.date}</td>
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
