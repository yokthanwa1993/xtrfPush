const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ntfy configuration
const NTFY_SERVER = process.env.NTFY_SERVER || 'https://ntfy.sh';
const NTFY_TOPIC = process.env.NTFY_TOPIC || 'caprover-notifications';
const NTFY_TOKEN = process.env.NTFY_TOKEN; // Optional: for private topics

class NtfyService {
    constructor(server = NTFY_SERVER, topic = NTFY_TOPIC, token = NTFY_TOKEN) {
        this.server = server;
        this.topic = topic;
        this.token = token;
    }

    /**
     * Send a simple notification
     * @param {string} message - The notification message
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} API response
     */
    async sendNotification(message, options = {}) {
        try {
            const headers = {
                'Content-Type': 'text/plain',
                'Priority': options.priority || 'default',
                'Tags': options.tags || 'bell'
            };

            // Add title only if it's ASCII safe
            if (options.title && /^[\x00-\x7F]*$/.test(options.title)) {
                headers['Title'] = options.title;
            } else if (options.title) {
                // Use default title for non-ASCII titles
                headers['Title'] = 'CapRover Notification';
            } else {
                headers['Title'] = 'CapRover Notification';
            }

            if (options.icon) headers['Icon'] = options.icon;
            if (options.actions) headers['Actions'] = options.actions;
            if (options.click) headers['Click'] = options.click;
            if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

            const response = await axios.post(`${this.server}/${this.topic}`, message, { headers });
            return {
                success: true,
                message: 'Notification sent successfully',
                data: response.data
            };
        } catch (error) {
            throw new Error(`Failed to send notification: ${error.message}`);
        }
    }

    /**
     * Send notification with different priorities
     * @param {string} message - The notification message
     * @param {string} priority - Priority level (min, low, default, high, urgent)
     * @returns {Promise<Object>} API response
     */
    async sendPriorityNotification(message, priority = 'default') {
        return this.sendNotification(message, { priority });
    }

    /**
     * Send urgent notification
     * @param {string} message - The notification message
     * @returns {Promise<Object>} API response
     */
    async sendUrgentNotification(message) {
        return this.sendNotification(message, { 
            priority: 'urgent',
            tags: 'rotating_light,fire',
            title: 'Urgent Alert'
        });
    }

    /**
     * Send notification with custom tags
     * @param {string} message - The notification message
     * @param {string} tags - Comma-separated tags
     * @returns {Promise<Object>} API response
     */
    async sendTaggedNotification(message, tags) {
        return this.sendNotification(message, { tags });
    }

    /**
     * Send notification with click action
     * @param {string} message - The notification message
     * @param {string} url - URL to open when clicked
     * @returns {Promise<Object>} API response
     */
    async sendClickableNotification(message, url) {
        return this.sendNotification(message, { click: url });
    }
}

// Initialize ntfy service
const ntfy = new NtfyService();

// Routes

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'ntfy-caprover',
        ntfy_server: NTFY_SERVER,
        topic: NTFY_TOPIC
    });
});

// Send simple notification
app.post('/notify', async (req, res) => {
    try {
        const { message, title, priority, tags, icon, click } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const result = await ntfy.sendNotification(message, {
            title,
            priority,
            tags,
            icon,
            click
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Send urgent notification
app.post('/notify/urgent', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const result = await ntfy.sendUrgentNotification(message);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Send notification with priority
app.post('/notify/priority/:priority', async (req, res) => {
    try {
        const { priority } = req.params;
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const result = await ntfy.sendPriorityNotification(message, priority);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Test endpoint
app.get('/test', async (req, res) => {
    try {
        const result = await ntfy.sendNotification(
            '🧪 Test notification from CapRover ntfy service!',
            {
                title: 'Test Notification',
                tags: 'test,check',
                priority: 'default'
            }
        );

        res.json({
            success: true,
            message: 'Test notification sent',
            result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Test failed',
            error: error.message
        });
    }
});

// CapRover specific endpoints

// Deployment notification
app.post('/caprover/deploy', async (req, res) => {
    try {
        const { appName, status, branch, commit } = req.body;
        
        const message = `🚀 Deployment ${status} for ${appName}${branch ? ` (${branch})` : ''}${commit ? `\nCommit: ${commit}` : ''}`;
        
        const result = await ntfy.sendNotification(message, {
            title: `CapRover Deployment - ${appName}`,
            tags: status === 'success' ? 'white_check_mark,rocket' : 'x,rocket',
            priority: status === 'success' ? 'default' : 'high'
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Server status notification
app.post('/caprover/status', async (req, res) => {
    try {
        const { status, details } = req.body;
        
        const message = `📊 Server Status: ${status}${details ? `\n${details}` : ''}`;
        
        const result = await ntfy.sendNotification(message, {
            title: 'CapRover Server Status',
            tags: 'server,chart_with_upwards_trend',
            priority: status === 'healthy' ? 'low' : 'high'
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Error notification
app.post('/caprover/error', async (req, res) => {
    try {
        const { error, appName, details } = req.body;
        
        const message = `❌ Error in ${appName || 'CapRover'}: ${error}${details ? `\n${details}` : ''}`;
        
        const result = await ntfy.sendUrgentNotification(message);

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ntfy CapRover service running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
    console.log(`🔔 ntfy server: ${NTFY_SERVER}`);
    console.log(`📋 Topic: ${NTFY_TOPIC}`);
});

module.exports = { app, NtfyService }; 