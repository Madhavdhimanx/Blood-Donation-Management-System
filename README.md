# Blood Donation Management System (BDMS)

This is a complete, full-fledged web application for Blood Donation Management based on the provided Entity-Relationship (ER) model and Relational Schema.

## Features
- **Database Model**: Fully implements the 7 entities (`DONOR`, `BLOOD_BANK`, `BLOOD_INVENTORY`, `DONATION`, `HOSPITAL`, `BLOOD_REQUEST`, `RECIPIENT`) in 3rd Normal Form using **SQLite**. Hardcoded data is automatically injected upon first run!
- **Modern User Interface**: A responsive UI built using vanilla HTML/JS/CSS featuring dark mode, glassmorphism aesthetics, and smooth animations.
- **Dual Interface Design**: 
  - Standard Forms to perform CRUD operations easily.
  - **Embedded SQL Terminal**: You can run raw SQLite queries inside the web interface that sync in real-time. Because SQLite uses a local `.db` file, you can also use your own command line terminal (e.g., `sqlite3 bdms.db`) to modify the database, and the changes will reflect in your UI!

## How to Run

### Step 1: Install Node.js
If you haven't already, please install Node.js from [nodejs.org](https://nodejs.org/). 

### Step 2: Install Project Dependencies
Open this folder (`c:\Users\madha\OneDrive\Desktop\DBMS Project`) in VS Code. Open your terminal in VS Code (Terminal > New Terminal) and run:

```bash
npm install
```
This will install `express` (web server), `sqlite3` (database), and `cors`.

### Step 3: Start the Backend Server
In the same terminal, run:
```bash
npm start
```
You should see: "Server is running on http://localhost:3000" and "Connected to the SQLite database. Inserting hardcoded initial data..."

### Step 4: Open the Applicaton
Open your web browser and go to `http://localhost:3000`. You can now navigate between the Dashboard, Donors CRUD view, and the SQL Terminal!
