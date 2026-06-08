messyMesh Setup Guide

This README explains how to use the `messyMesh_setup.sh` script to initialize the project foundation, namely, messyMesh repository on Ubuntu.

## What this script does
The script automates the "Ground Zero" setup for **Project messyMesh**:
1. **System Updates:** Refreshes your Ubuntu package list.
2. **IDE Installation:** Installs **Visual Studio Code**.
3. **Backend Engines:** Installs **PHP 8.x** and **MySQL Server**.
4. **Frontend Engine:** Installs **Node.js (LTS)** via NVM.
5. **Workspace Creation:** Builds the following structure in `~/Documents/messyMesh`:
    - `frontend/` (React/Vite space)
    - `backend/api/` (PHP logic space)
    - `backend/uploads/` (Secure document vault)
    - `backend/config/` (Database settings)

## 🛠 How to Run the Setup?

1. **Open your Terminal** (Ctrl+Alt+T).
2. **Make the script executable:**
   ```run this command:
   chmod +x ~/messyMesh_setup.sh
   ~/messyMesh_setup.sh
   
   
## After running the script:
1. **Secure MySQL**
    ```run this command:
    sudo mysql_secure_installation
    
    **Recommendation: Set a password you'll remember (like amNekku2026).**
    **Settings: Say Yes (Y) to removing anonymous users and disallowing remote root login to keep it secure.**
    
2. **Create the "messyMesh" Database**
   ```run this command:
   sudo mysql -u root -p
   
   ```paste this commands (one by one):
    -- 1. Create the Database:
    CREATE DATABASE messymesh_db;
    USE messymesh_db;

    -- 2. Create the Users Table (This handles your 3 access levels):
    CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'employee', 'student') DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Create the Hierarchy (Communities and Collections):
    CREATE TABLE communities (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT
    );

    CREATE TABLE collections (
        id INT PRIMARY KEY AUTO_INCREMENT,
        community_id INT,
        name VARCHAR(255) NOT NULL,
        FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE
    );

    -- 4. Create the Items Table (The Documents):
    CREATE TABLE items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        collection_id INT,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        file_path VARCHAR(512),
        is_public BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (collection_id) REFERENCES collections(id)
    );
    
    -- 5. Creating admin:
    INSERT INTO users (username, password_hash, role)
    VALUES ('amnekku', 'amnekku2026', 'admin');
    
    -- 6. Close MySQL:
    exit
    
## Making the "Handshake", the medium as translator:
##In a web application, your files (folders) and your database (MySQL) are like two people who don't speak the same language. We are going to write a PHP script that acts as the translator. This script will live in your backend/config folder.
1. **Open messyMesh in VS Code**
    ```run this command:
    code ~/Documents/messyMesh
    
2. **Create a new file /backend/config and name it db_connect.php**
    ```paste this:
    <?php
    $host = "localhost";
    $dbname = "messymesh_db";
    $username = "root";
    $password = "amNekku2026";

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        // Set error mode so we can see if something goes wrong
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // echo "Connected successfully to messyMesh!"; 
    } catch (PDOException $e) {
        die("Asena, kabaw: " . $e->getMessage());
    }
    ?>
    
    ```run this command:
    sudo php ~/Documents/messyMesh/backend/config/db_connect.php
    
    **If it returns a blank line, you have successfully linked your PHP files to your MySQL database.**
    
## I am the "GATEKEEPER"
1. **Create a new file /backend/api and name it login.php**
   ```paste this:
	<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	    http_response_code(200);
	    exit;
	}
	// 1. Include the 'Handshake' file we just made
	require_once '../config/db_connect.php';

	// 2. Tell the browser we are sending back JSON (standard for modern apps)
	header('Content-Type: application/json');

	// 3. Get the data from the login form
	$user = $_POST['username'] ?? '';
	$pass = $_POST['password'] ?? '';

	if (!$user || !$pass) {
	    echo json_encode(["status" => "error", "message" => "Missing credentials"]);
	    exit;
	}

	// 4. Check the database for the user
	try {
	    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
	    $stmt->execute([$user]);
	    $account = $stmt->fetch();

	    // 5. Verify the password and role
	    if ($account && $pass === $account['password_hash']) {
		echo json_encode([
		    "status" => "success",
		    "role" => $account['role'], // Tells the app if they are 'admin', 'employee', or 'student'
		    "message" => "Welcome, " . $account['username']
		]);
	    } else {
		echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
	    }
	} catch (PDOException $e) {
	    echo json_encode(["status" => "error", "message" => "Database error"]);
	}
	?>

	// 4. Check the database for the user
	try {
	    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
	    $stmt->execute([$user]);
	    $account = $stmt->fetch();

	    // 5. Verify the password and role
	    if ($account && $pass === $account['password_hash']) {
		echo json_encode([
		    "status" => "success",
		    "role" => $account['role'], // Tells the app if they are 'admin', 'employee', or 'student'
		    "message" => "Welcome, " . $account['username']
		]);
	    } else {
		echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
	    }
	} catch (PDOException $e) {
	    echo json_encode(["status" => "error", "message" => "Database error"]);
	}
	?>
	
2. **Test the connection**
   ```run this command: starting the server
   cd ~/Documents/messyMesh/backend
   php -S localhost:8000
   
   ```then in another terminal:
   curl -X POST -d "username=amnekku&password=amNekku2026" http://localhost:8000/api/login.php
   curl -X POST -d "username=amnekku&password=amnekku" http://localhost:8000/api/login.php
   
   ```what to expect: (if the server returns a 200, is a success)
   
   "kcplibrary@kcplibrary:~/Documents/messyMesh/backend$ php -S localhost:8000
   [Fri May  8 10:34:39 2026] PHP 8.4.5 Development Server (http://localhost:8000) started
   [Fri May  8 10:34:59 2026] 127.0.0.1:52562 Accepted
   [Fri May  8 10:34:59 2026] 127.0.0.1:52562 [200]: POST /api/login.php
   [Fri May  8 10:34:59 2026] 127.0.0.1:52562 Closing"
   
   
   Note: In case, it denies the login, here's the fix:
   1. **Login back to MySQL**
   	```run this command:
   	sudo mysql -u root
   	
   2. **Paste these two lines inside the MySQL prompt**
   	-- Lower security for development
	SET GLOBAL validate_password.policy = LOW;
	SET GLOBAL validate_password.length = 4;

	-- Update root to use modern authentication
	ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'amNekku2026';
	FLUSH PRIVILEGES;
	
   3. **Initialize**
  	USE messymesh_db;

	-- Clear the table just in case there's a typo'd version
	TRUNCATE TABLE users; 

	-- Insert the fresh admin account
	INSERT INTO users (username, password_hash, role) 
	VALUES ('amnekku', 'amNekku2026', 'admin');

	EXIT;
	
	```then test again, run this command:
	curl -X POST -d "username=amnekku&password=amNekku2026" http://localhost:8000/api/login.php
	
	Expected Result: {"status":"success","role":"admin","message":"Welcome, amnekku"}
	
	To view the database visually:
	cd /usr/share/phpmyadmin
	sudo php -S localhost:8080
	
	Open it in your browser:
	http://localhost:8080 | Username: root | Password: amNekku2026
	

## Setting up Frontend

1. Initialization:
	1. Run this commands:
	cd ~/Documents/messyMesh

	# This command puts the React structure into the existing folder
	npm create vite@latest frontend -- --template react

	# Now, go inside and install the 'muscles' (dependencies)
	cd frontend
	npm install
	npm install axios
	npm install -D tailwindcss postcss autoprefixer
	npm install -D @tailwindcss/postcss
	
	2. Create new file, /frontend, name it tailwind.config.js, then paste this:
	
	/** @type {import('tailwindcss').Config} */
	export default {
	  content: [
	    "./index.html",
	    "./src/**/*.{js,ts,jsx,tsx}",
	  ],
	  theme: {
	    extend: {},
	  },
	  plugins: [],
	}
	
	3. Same folder, create new file, name it postcss.config.js, then paste this:
	export default {
	  plugins: {
	    '@tailwindcss/postcss': {}, // Notice the new name here
	    autoprefixer: {},
	  },
	}
	
	4. Go to src/index.css, delete everything and paste this:
	@import "tailwindcss";
	
	5. Go to src/App.jsx, delete everything and paste this:
	import { useState } from 'react';
	import axios from 'axios';
	import './index.css'; // This links the Tailwind styles!

	function App() {
	  const [username, setUsername] = useState('');
	  const [password, setPassword] = useState('');
	  const [message, setMessage] = useState('');

	  const handleLogin = async (e) => {
	    e.preventDefault();
	    const formData = new FormData();
	    formData.append('username', username);
	    formData.append('password', password);

	    try {
	      // Direct hit to your PHP server
	      const response = await axios.post('http://localhost:/api/login.php', formData);
	      
	      if (response.data.status === 'success') {
		setMessage(`Success! Role: ${response.data.role}`);
	      } else {
		setMessage(response.data.message);
	      }
	    } catch (err) {
	      console.error(err);
	      setMessage("Connection Failed. Is the PHP server running?");
	    }
	  };

	  return (
	    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-slate-100">
	      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-10">
		<h1 className="text-5xl font-black text-center mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
		  messyMesh
		</h1>
		<p className="text-center text-slate-400 mb-10 uppercase tracking-widest text-xs font-bold">Secure Archive Access</p>

		<form onSubmit={handleLogin} className="space-y-6">
		  <input 
		    type="text" 
		    placeholder="Username"
		    className="w-full px-4 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
		    value={username} 
		    onChange={(e) => setUsername(e.target.value)} 
		  />
		  <input 
		    type="password" 
		    placeholder="Password"
		    className="w-full px-4 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
		    value={password} 
		    onChange={(e) => setPassword(e.target.value)} 
		  />
		  <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-black rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-95">
		    UNLOCK VAULT
		  </button>
		</form>

		{message && (
		  <div className={`mt-8 p-4 rounded-xl text-center font-bold border-2 ${
		    message.includes('Success') ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-rose-500 bg-rose-500/10 text-rose-400'
		  }`}>
		    {message}
		  </div>
		)}
	      </div>
	    </div>
	  );
	}

	export default App;
	
	6. Test: Launch Sequence

	    Terminal 1: cd Documents/messyMesh/backend && php -S localhost:8000 or php -S 127.0.0.1:8000  *For dailies
	    Terminal 2: cd /usr/share/phpmyadmin && sudo php -S localhost:8080
	    Terminal 3: cd Documents/messyMesh/frontend && npm run dev
	    Terminal 4: cd Documents/messyMesh/ && ngrok http 8000 *For dailies
	    Open browser to http://localhost:5173
	    
	    Additional info: where the database lives on the computer server
	    admin:///var/lib/mysql/messymesh_db
	    
		    How to check:
		    sudo ls -la /var/lib/mysql/messymesh_db
	    
	    Ngrok Setup for messyMesh
		customer-yahoo-outing.ngrok-free.dev
		rd_3E1YsA6HMMk41lr1PBivsMdvXHR
		ngrok http 8000


	    
	    
## Admin Dashboard and Admin access
1. **Install React Router**
	```run this command in frontend directory:
	npm install react-router-dom
	
2. **Create the Dashboard Component**
	```Create a new file in frontend/src/Dashboard.jsx.
_____________________________________________________________________________________________
git add .
git commit -m "ayappooooo unayennn"
git push origin main

Running the system:
Terminal 1: cd Documents/messyMesh && php -S 127.0.0.1:8000        //backend server
Terminal 2: cd Documents/messyMesh && ngrok http 8000              //ngrok server
Terminal 3: cd /usr/share/phpmyadmin && sudo php -S localhost:8080  //mysql database server
Terminal 4: cd Documents/messyMesh && sudo systemctl start mysql     //checking mysql database status
Terminal 5: cd Documents/messyMesh/frontend && npm run dev         //frontend




