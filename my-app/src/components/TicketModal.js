import React, { useState } from 'react';
import './TicketModal.css';
import api from '../api'; //for connecting with the api
 
const TicketModal = ({ ticket, onClose, onAction }) => {
  const [selectedStatus, setSelectedStatus] = useState(ticket?.status || 'Open'); // Set initial status from the ticket
 
  if (!ticket) return null; // Return nothing if no ticket is selected
 
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };
 
  const handleMarkAsResolved = async () => {
    try {
      await api.put(`/tickets/tickets/${ticket._id}/statusresolve`); // No body needed
      onAction('resolved'); // Trigger the onAction callback with 'resolved'
      onClose();
    } catch (error) {
      console.error('Error marking ticket as resolved:', error);
    }
  };
 
  const handleChangeStatus = async () => {
    try {
      console.log(`Sending PUT request to /tickets/${ticket._id}/status`); // Log the URL
      
      // Sending the PUT request to update the ticket status
      const response = await api.put(`/tickets/tickets/${ticket._id}/status`, { status: selectedStatus });
  
      // Check if the response is successful
      if (response.status === 200) {
        // Call onAction and onClose only if the status update is successful
        onAction(selectedStatus);
        onClose();
      } else {
        // Handle other status codes or errors that might not be caught by the catch block
        throw new Error('Unexpected response from server.');
      }
    } catch (error) {
      // Check if error response is available and contains a message
      if (error.response && error.response.data && error.response.data.msg) {
        // Display the error message from the backend
        alert(`Error: ${error.response.data.msg}`);
      } else {
        // Display a generic error message
        alert('Error changing ticket status. Please try again later.');
      }
      
      console.error('Error changing ticket status:', error);
    }
  };
 
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Ticket Details</h5>
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="modal-body">
          <p><strong>Ticket ID:</strong> {ticket._id}</p>
          <p><strong>Customer Name:</strong> {ticket.customer.name}</p>
          <p><strong>Subject:</strong> {ticket.title}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Date Created:</strong>{new Date(ticket.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })}</p>
          
          {/* Attachments Section */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="attachments-section">
              <h6>Attachments:</h6>
              <div className="attachments-list">
      {ticket.attachments.map((attachment, index) => (
        <div key={index} className="attachment-item">
          <img src={`http://localhost:5000/${attachment}`} alt={`Attachment ${index + 1}`} className="attachment-image" />
        </div>
      ))}
    </div>
            </div>
          )}
        </div>
        <div className="modal-footer">         
          {/* Add margin class to the select element */}
          <select className="status-select" value={selectedStatus} onChange={handleStatusChange}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
  
          <button className="action-button" onClick={handleChangeStatus}>
            Change Status
          </button>
        </div>
      </div>
    </div>
  );
  
};
 
export default TicketModal;