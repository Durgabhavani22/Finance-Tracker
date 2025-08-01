const http = require('http');
const mysql = require('mysql');
const url = require('url');
const crypto = require('crypto');

// In-memory session store
const sessions = {};

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'finance',
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected');
});

function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    list[parts[0].trim()] = decodeURIComponent(parts[1]);
  });
  return list;
}

function generateSessionId() {
  return crypto.randomBytes(16).toString('hex');
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  const cookies = parseCookies(req);
  const sessionId = cookies.sessionId;
  const userSession = sessions[sessionId];

  // CORS setup
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ========== REGISTER ==========
  if (path === '/register' && method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const { username, email, password } = JSON.parse(body);
      const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      db.query(sql, [username, email, password], (err) => {
        if (err) {
          res.writeHead(500);
          return res.end(JSON.stringify({ msg: "Registration failed" }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ msg: "User registered" }));
      });
    });

  // ========== LOGIN ==========
  } else if (path === '/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const { email, password } = JSON.parse(body);
      const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
      db.query(sql, [email, password], (err, results) => {
        if (results.length > 0) {
          const user = results[0];
          const newSessionId = generateSessionId();
          sessions[newSessionId] = { user };
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `sessionId=${newSessionId}; HttpOnly`,
          });
          res.end(JSON.stringify({ msg: "Login success", user }));
        } else {
          res.writeHead(401);
          res.end(JSON.stringify({ msg: "Invalid credentials" }));
        }
      });
    });

  // ========== LOGOUT ==========
  } else if (path === '/logout') {
    if (sessionId) delete sessions[sessionId];
    res.writeHead(200, { 'Set-Cookie': 'sessionId=; Max-Age=0' });
    res.end(JSON.stringify({ msg: "Logged out" }));

  // ========== DASHBOARD ==========
  } else if (path === '/dashboard' && method === 'GET') {
    if (!userSession) {
      res.writeHead(401);
      return res.end(JSON.stringify({ msg: "Not logged in" }));
    }
    const userId = userSession.user.id;
    const sql = `
      SELECT 
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS total_expense
      FROM transactions WHERE user_id = ?
    `;
    db.query(sql, [userId], (err, result) => {
      const row = result[0] || {};
      const income = row.total_income || 0;
      const expense = row.total_expense || 0;
      const balance = income - expense;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ income, expense, balance }));
    });

  // ========== ADD TRANSACTION ==========
  } else if (path === '/add-transaction' && method === 'POST') {
    if (!userSession) {
      res.writeHead(401);
      return res.end(JSON.stringify({ msg: "Not logged in" }));
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { title, type, amount, date } = JSON.parse(body);
      const user_id = userSession.user.id;
const sql = "INSERT INTO transactions (user_id, type, title, amount, description, date) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [userId, type, title, amount, description, date], (err) => {
        if (err) {
          res.writeHead(500);
          return res.end(JSON.stringify({ msg: "Add failed" }));
        }
        res.writeHead(200);
        res.end(JSON.stringify({ msg: "Transaction added" }));
      });
    });

  // ========== TRANSACTION HISTORY ==========
  } else if (path === '/transactions' && method === 'GET') {
    if (!userSession) {
      res.writeHead(401);
      return res.end(JSON.stringify({ msg: "Not logged in" }));
    }
    const user_id = userSession.user.id;
    const sql = "SELECT id, type, title, amount, description, date FROM transactions WHERE user_id = ? ORDER BY date DESC";
    db.query(sql, [user_id], (err, result) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });

  // ========== UPDATE SETTINGS ==========
  } else if (path === '/update-settings' && method === 'POST') {
    if (!userSession) {
      res.writeHead(401);
      return res.end(JSON.stringify({ msg: "Not logged in" }));
    }
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      const user_id = userSession.user.id;
      const sql = "UPDATE users SET username = ?, password = ? WHERE id = ?";
      db.query(sql, [username, password, user_id], (err) => {
        if (err) {
          res.writeHead(500);
          return res.end(JSON.stringify({ msg: "Update failed" }));
        }
        sessions[sessionId].user.username = username;
        res.writeHead(200);
        res.end(JSON.stringify({ msg: "User updated" }));
      });
    });

  // ✅ ========== ANALYTICS ==========
  } else if (path === '/analytics' && method === 'GET') {
    if (!userSession) {
      res.writeHead(401);
      return res.end(JSON.stringify({ msg: "Not logged in" }));
    }

    const user_id = userSession.user.id;
    const sql = `
      SELECT 
        MONTH(date) as month,
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE user_id = ?
      GROUP BY MONTH(date)
      ORDER BY MONTH(date)
    `;
    db.query(sql, [user_id], (err, result) => {
      if (err) {
        res.writeHead(500);
        return res.end(JSON.stringify({ msg: "Analytics fetch error" }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });

  // ========== UNKNOWN ==========
  } else {
    res.writeHead(404);
    res.end("Route not found");
  }
});

server.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
