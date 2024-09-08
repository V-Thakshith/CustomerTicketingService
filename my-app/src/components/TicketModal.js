import React, { useState } from 'react';
import axios from 'axios';
import './TicketModal.css';
import api from '../api'; //for connecting with the api
 
const TicketModal = ({ ticket, onClose, onAction }) => {
  const [selectedStatus, setSelectedStatus] = useState(ticket?.status || 'Open'); // Set initial status from the ticket
  const [isPopupOpen, setIsPopupOpen] = useState(false);
 
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
      await api.put(`/tickets/tickets/${ticket._id}/status`, { status: selectedStatus });
      onAction(selectedStatus); // Trigger the onAction callback with the selected status
      onClose(); // Close the modal after successful status change
    } catch (error) {
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
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Date Created:</strong> {ticket.createdAt}</p>
        </div>
        <div className="modal-footer">
          <button className="action-button" onClick={handleMarkAsResolved}>
            Mark as Resolved
          </button>
         
          {/* Add margin class to the select element */}
          <select className="status-select" value={selectedStatus} onChange={handleStatusChange}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
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