const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ status: 'Backend API running' });
});

// Profile endpoint
app.get('/api/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // For now, return a mock profile since we don't have a profiles table
    // In a real app, you'd query the database for user profile data
    const profile = {
      id: userId,
      email: 'user@example.com',
      name: 'User Name',
      role: 'treasurer',
      avatar: null,
      created_at: new Date().toISOString()
    };
    
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
});

// Dashboard API endpoints
app.get('/api/donations', async (req, res) => {
  // Query donations grouped by month and type
  try {
    const { timeframe = 'annual' } = req.query;
    // Example: group by month for the current year
    const result = await pool.query(`
      SELECT
        to_char(date, 'Mon') AS month,
        SUM(CASE WHEN type = 'Tithe' THEN amount ELSE 0 END) AS tithes,
        SUM(CASE WHEN type = 'Offering' THEN amount ELSE 0 END) AS offerings,
        SUM(CASE WHEN type = 'Campaign' THEN amount ELSE 0 END) AS campaigns
      FROM donations
      WHERE date >= date_trunc('year', CURRENT_DATE)
      GROUP BY month
      ORDER BY date_trunc('month', date)
    `);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donations', details: err.message });
  }
});

app.get('/api/donations/recent', async (req, res) => {
  // Query recent donations (last 5)
  try {
    const result = await pool.query(`
      SELECT id, name, amount, type, date, status
      FROM donations
      ORDER BY date DESC
      LIMIT 5
    `);
    res.json({ data: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch recent donations', details: err.message });
  }
});

app.get('/api/metrics/system', async (req, res) => {
  // Query system metrics: total members, monthly giving, active groups, upcoming events
  try {
    const [members, giving, groups, events] = await Promise.all([
      pool.query('SELECT COUNT(*) AS total FROM members'),
      pool.query(`SELECT COALESCE(SUM(amount),0) AS total FROM donations WHERE date >= date_trunc('month', CURRENT_DATE)`),
      pool.query('SELECT COUNT(*) AS total FROM groups'),
      pool.query(`SELECT COUNT(*) AS total FROM events WHERE event_date >= CURRENT_DATE`)
    ]);
    res.json({
      data: [
        { title: 'Total Members', value: members.rows[0].total, icon: 'Users', change: '', trend: 'up', color: 'text-xiracom-blue' },
        { title: 'Monthly Giving', value: giving.rows[0].total, icon: 'DollarSign', change: '', trend: 'up', color: 'text-green-600' },
        { title: 'Active Groups', value: groups.rows[0].total, icon: 'BookOpen', change: '', trend: 'up', color: 'text-xiracom-orange' },
        { title: 'Upcoming Events', value: events.rows[0].total, icon: 'Calendar', change: '', trend: 'neutral', color: 'text-purple-600' }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch system metrics', details: err.message });
  }
});

// --- CRUD Endpoints for Dashboard Resources ---

// Helper: generic CRUD for a table
function crudRoutes(resource, table, fields) {
  // List all
  app.get(`/api/${resource}`, async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM ${table} ORDER BY id DESC`);
      res.json({ data: result.rows });
    } catch (err) {
      res.status(500).json({ error: `Failed to fetch ${resource}`, details: err.message });
    }
  });
  // Get one
  app.get(`/api/${resource}/:id`, async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: `${resource} not found` });
      res.json({ data: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: `Failed to fetch ${resource}`, details: err.message });
    }
  });
  // Create
  app.post(`/api/${resource}`, async (req, res) => {
    try {
      const keys = Object.keys(req.body).filter(k => fields.includes(k));
      const values = keys.map(k => req.body[k]);
      const placeholders = keys.map((_, i) => `$${i+1}`).join(', ');
      const result = await pool.query(
        `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      res.status(201).json({ data: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: `Failed to create ${resource}`, details: err.message });
    }
  });
  // Update
  app.put(`/api/${resource}/:id`, async (req, res) => {
    try {
      const keys = Object.keys(req.body).filter(k => fields.includes(k));
      const values = keys.map(k => req.body[k]);
      if (keys.length === 0) return res.status(400).json({ error: 'No valid fields to update' });
      const setClause = keys.map((k, i) => `${k} = $${i+1}`).join(', ');
      const result = await pool.query(
        `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length+1} RETURNING *`,
        [...values, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: `${resource} not found` });
      res.json({ data: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: `Failed to update ${resource}`, details: err.message });
    }
  });
  // Delete
  app.delete(`/api/${resource}/:id`, async (req, res) => {
    try {
      const result = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [req.params.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: `${resource} not found` });
      res.json({ data: result.rows[0] });
    } catch (err) {
      res.status(500).json({ error: `Failed to delete ${resource}`, details: err.message });
    }
  });
}

crudRoutes('donations', 'donations', ['member_id','name','amount','type','date','status']);
crudRoutes('members', 'members', ['name','email','phone','joined_at','status']);
crudRoutes('groups', 'groups', ['name','description']);
crudRoutes('events', 'events', ['name','event_date','description']);
crudRoutes('expenses', 'expenses', ['member_id','description','amount','category','expense_date']);
crudRoutes('budgets', 'budgets', ['name','amount','start_date','end_date']);
crudRoutes('campaigns', 'campaigns', ['name','goal_amount','start_date','end_date','description']);
crudRoutes('pledges', 'pledges', ['member_id','campaign_id','amount','pledge_date','status']);

app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`);
}); 