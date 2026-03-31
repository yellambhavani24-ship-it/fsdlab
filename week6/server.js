const express = require("express"); 
const jwt = require("jsonwebtoken"); 
const fs = require("fs"); 
const path = require("path"); 
const app = express(); 
const PORT = 3000; 
const SECRET_KEY = "supersecretkey"; 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public"))); 
const dbPath = path.join(__dirname, "database.json"); 
// Read database 
function readDatabase() { 
return JSON.parse(fs.readFileSync(dbPath, "utf-8")); 
} 
// Write database 
function writeDatabase(data) { 
fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); 
} 
/* ============================== 
JWT AUTH MIDDLEWARE 
================================= */ 
function authenticateToken(req, res, next) { 
const authHeader = req.headers["authorization"]; 
const token = authHeader && authHeader.split(" ")[1]; 
if (!token) return res.status(401).json({ message: "Token required" }); 
jwt.verify(token, SECRET_KEY, (err, user) => { 
if (err) return res.status(403).json({ message: "Invalid token" }); 
req.user = user; 
next(); 
}); 
} 
/* ============================== 
   REGISTER 
================================= */ 
app.post("/register", (req, res) => { 
  const { username, password } = req.body; 
 
  const db = readDatabase(); 
 
  const userExists = db.users.find(u => u.username === username); 
  if (userExists) { 
    return res.status(400).json({ message: "User already exists" }); 
  } 
 
  const newUser = { 
    id: Date.now(), 
    username, 
    password 
  }; 
 
  db.users.push(newUser); 
  writeDatabase(db); 
 
  res.json({ message: "Registration successful" }); 
}); 
 
/* ============================== 
   LOGIN 
================================= */ 
app.post("/login", (req, res) => { 
  const { username, password } = req.body; 
 
  const db = readDatabase(); 
 
  const user = db.users.find( 
    u => u.username === username && u.password === password 
  ); 
 
  if (!user) { 
    return res.status(401).json({ message: "Invalid credentials" }); 
  } 
 
  const token = jwt.sign( 
    { id: user.id, username: user.username }, 
    SECRET_KEY, 
    { expiresIn: "1h" } 
  ); 
 
  res.json({ token }); 
console.log(‘The generated token is:’, token); 
}); 
 
/* ============================== 
   PROFILE (Protected) 
================================= */ 
app.get("/profile-data", authenticateToken, (req, res) => { 
  res.json({ 
    message: "Welcome to your profile", 
    user: req.user 
  }); 
}); 
 
app.listen(PORT, () => { 
  console.log(`Server running at http://localhost:${PORT}`); 
});