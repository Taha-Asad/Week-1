const Contact = require('../models/contact');
const Admin = require('../models/admin');
const { SendEmail } = require('../config/nodeMailer');

// User submits contact form
const submitContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        // Send confirmation email to user
        try {
            await SendEmail(email, 'Message Received - Café Bliss', 'contactReceived', {
                name,
                subject,
                message
            });
        } catch (emailError) {
            console.error('User email sending failed:', emailError);
            // Don't fail the contact submission if email fails
        }

        // Send notification email to admin
        try {
            // Get admin emails from database
            const admins = await Admin.find({}, 'email');
            
            if (admins.length > 0) {
                for (const admin of admins) {
                    await SendEmail(admin.email, 'New Contact Form Submission - Café Bliss', 'contactReceived', {
                        adminName: admin.name || 'Admin',
                        contactName: name,
                        contactEmail: email,
                        contactSubject: subject,
                        contactMessage: message,
                        submissionTime: new Date().toLocaleString()
                    });
                }
            } else {
                // Fallback to environment variable if no admin in database
                const adminEmail = process.env.ADMIN_EMAIL;
                if (adminEmail) {
                    await SendEmail(adminEmail, 'New Contact Form Submission - Café Bliss', 'contactReceived', {
                        adminName: 'Admin',
                        contactName: name,
                        contactEmail: email,
                        contactSubject: subject,
                        contactMessage: message,
                        submissionTime: new Date().toLocaleString()
                    });
                }
            }
        } catch (adminEmailError) {
            console.error('Admin notification email failed:', adminEmailError);
            // Don't fail the contact submission if admin email fails
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.',
            contact
        });

    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin gets all contacts
const getAllContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        
        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('repliedBy', 'name');

        const total = await Contact.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            contacts,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin gets single contact
const getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id)
            .populate('repliedBy', 'name');

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            success: true,
            contact
        });

    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin updates contact status
const updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        contact.status = status;
        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Contact status updated successfully',
            contact
        });

    } catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin replies to contact
const replyToContact = async (req, res) => {
    try {
        const { adminReply } = req.body;
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        contact.adminReply = adminReply;
        contact.status = 'replied';
        contact.repliedAt = new Date();
        contact.repliedBy = req.admin._id;
        await contact.save();

        // Send reply email to user
        try {
            await SendEmail(contact.email, `Re: ${contact.subject} - Café Bliss`, 'contactReceived', {
                name: contact.name,
                subject: contact.subject,
                message: contact.message,
                adminReply: adminReply,
                repliedBy: req.admin.name || 'Admin',
                repliedAt: new Date().toLocaleString()
            });
        } catch (replyEmailError) {
            console.error('Reply email sending failed:', replyEmailError);
            // Don't fail the reply if email fails
        }

        // Send copy to admin for record keeping
        try {
            const adminEmail = req.admin.email;
            if (adminEmail) {
                await SendEmail(adminEmail, `Reply Sent - ${contact.subject}`, 'contactReceived', {
                    adminName: req.admin.name || 'Admin',
                    contactName: contact.name,
                    contactEmail: contact.email,
                    contactSubject: contact.subject,
                    contactMessage: contact.message,
                    adminReply: adminReply,
                    repliedBy: req.admin.name || 'Admin',
                    repliedAt: new Date().toLocaleString()
                });
            }
        } catch (adminCopyError) {
            console.error('Admin copy email failed:', adminCopyError);
            // Don't fail the reply if admin copy fails
        }

        res.status(200).json({
            success: true,
            message: 'Reply sent successfully',
            contact
        });

    } catch (error) {
        console.error('Reply to contact error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin deletes contact
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        await Contact.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Contact deleted successfully'
        });

    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin bulk delete contacts
const bulkDeleteContacts = async (req, res) => {
    try {
        const { contactIds } = req.body;

        if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide contact IDs to delete'
            });
        }

        await Contact.deleteMany({ _id: { $in: contactIds } });

        res.status(200).json({
            success: true,
            message: `${contactIds.length} contacts deleted successfully`
        });

    } catch (error) {
        console.error('Bulk delete contacts error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get contact statistics
const getContactStats = async (req, res) => {
    try {
        const total = await Contact.countDocuments();
        const unread = await Contact.countDocuments({ status: 'unread' });
        const read = await Contact.countDocuments({ status: 'read' });
        const replied = await Contact.countDocuments({ status: 'replied' });

        // Get recent contacts (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recent = await Contact.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.status(200).json({
            success: true,
            stats: {
                total,
                unread,
                read,
                replied,
                recent
            }
        });

    } catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    submitContact,
    getAllContacts,
    getContact,
    updateContactStatus,
    replyToContact,
    deleteContact,
    bulkDeleteContacts,
    getContactStats
}; 