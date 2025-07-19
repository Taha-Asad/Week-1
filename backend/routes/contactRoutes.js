const express = require('express');
const {
    submitContact,
    getAllContacts,
    getContact,
    updateContactStatus,
    replyToContact,
    deleteContact,
    bulkDeleteContacts,
    getContactStats
} = require('../controllers/contactController');
const adminAuth = require('../helper/adminAuth');

const contactRouter = express.Router();

// User routes
contactRouter.post('/submit', submitContact);

// Admin routes (protected)
contactRouter.get('/all', adminAuth, getAllContacts);
contactRouter.get('/stats', adminAuth, getContactStats);
contactRouter.get('/:id', adminAuth, getContact);
contactRouter.put('/:id/status', adminAuth, updateContactStatus);
contactRouter.put('/:id/reply', adminAuth, replyToContact);
contactRouter.delete('/:id', adminAuth, deleteContact);
contactRouter.delete('/bulk-delete', adminAuth, bulkDeleteContacts);

module.exports = contactRouter; 