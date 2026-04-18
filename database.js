const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'bdms.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to the database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDb();
    }
});

function initializeDb() {
    db.serialize(() => {
        // Create DONOR Table
        db.run(`CREATE TABLE IF NOT EXISTS DONOR (
            donor_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            dob DATE NOT NULL,
            gender CHAR(1) NOT NULL,
            blood_group VARCHAR(5) NOT NULL,
            phone VARCHAR(15) UNIQUE,
            email VARCHAR(100) UNIQUE,
            address TEXT,
            registration_date DATE NOT NULL
        )`);

        // Create BLOOD_BANK Table
        db.run(`CREATE TABLE IF NOT EXISTS BLOOD_BANK (
            bank_id INTEGER PRIMARY KEY AUTOINCREMENT,
            bank_name VARCHAR(100) NOT NULL,
            location VARCHAR(100) NOT NULL,
            contact_phone VARCHAR(15),
            email VARCHAR(100),
            capacity INT NOT NULL
        )`);

        // Create BLOOD_INVENTORY Table
        db.run(`CREATE TABLE IF NOT EXISTS BLOOD_INVENTORY (
            inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
            bank_id INTEGER,
            blood_group VARCHAR(5) NOT NULL,
            quantity_units INTEGER NOT NULL,
            collection_date DATE NOT NULL,
            expiry_date DATE NOT NULL,
            status VARCHAR(20) NOT NULL,
            FOREIGN KEY (bank_id) REFERENCES BLOOD_BANK(bank_id)
        )`);

        // Create DONATION Table
        db.run(`CREATE TABLE IF NOT EXISTS DONATION (
            donation_id INTEGER PRIMARY KEY AUTOINCREMENT,
            donor_id INTEGER,
            bank_id INTEGER,
            donation_date DATE NOT NULL,
            quantity_ml INTEGER NOT NULL,
            blood_group VARCHAR(5) NOT NULL,
            hepatitis_test VARCHAR(15) NOT NULL,
            hiv_test VARCHAR(15) NOT NULL,
            test_results VARCHAR(50) NOT NULL,
            FOREIGN KEY (donor_id) REFERENCES DONOR(donor_id),
            FOREIGN KEY (bank_id) REFERENCES BLOOD_BANK(bank_id)
        )`);

        // Create HOSPITAL Table
        db.run(`CREATE TABLE IF NOT EXISTS HOSPITAL (
            hospital_id INTEGER PRIMARY KEY AUTOINCREMENT,
            hospital_name VARCHAR(100) NOT NULL,
            location VARCHAR(100) NOT NULL,
            contact_phone VARCHAR(15),
            email VARCHAR(100)
        )`);

        // Create BLOOD_REQUEST Table
        db.run(`CREATE TABLE IF NOT EXISTS BLOOD_REQUEST (
            request_id INTEGER PRIMARY KEY AUTOINCREMENT,
            hospital_id INTEGER,
            bank_id INTEGER,
            blood_group VARCHAR(5) NOT NULL,
            units_requested INTEGER NOT NULL,
            request_date DATE NOT NULL,
            urgency VARCHAR(20) NOT NULL,
            status VARCHAR(20) NOT NULL,
            FOREIGN KEY (hospital_id) REFERENCES HOSPITAL(hospital_id),
            FOREIGN KEY (bank_id) REFERENCES BLOOD_BANK(bank_id)
        )`);

        // Create RECIPIENT Table
        db.run(`CREATE TABLE IF NOT EXISTS RECIPIENT (
            recipient_id INTEGER PRIMARY KEY AUTOINCREMENT,
            hospital_id INTEGER,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            dob DATE NOT NULL,
            blood_group VARCHAR(5) NOT NULL,
            gender CHAR(1) NOT NULL,
            phone VARCHAR(15),
            email VARCHAR(100),
            address TEXT,
            admission_date DATE NOT NULL,
            FOREIGN KEY (hospital_id) REFERENCES HOSPITAL(hospital_id)
        )`);

        // Insert Default Hardcoded Data (Only if empty)
        db.get('SELECT COUNT(*) as count FROM DONOR', (err, row) => {
            if (row && row.count === 0) {
                console.log('Inserting hardcoded initial data...');
                
                db.run(`INSERT INTO DONOR (first_name, last_name, dob, gender, blood_group, phone, email, address, registration_date) 
                        VALUES ('John', 'Doe', '1990-05-15', 'M', 'O+', '1234567890', 'john@example.com', '123 Main St', '2023-01-10')`);
                db.run(`INSERT INTO DONOR (first_name, last_name, dob, gender, blood_group, phone, email, address, registration_date) 
                        VALUES ('Jane', 'Smith', '1985-08-22', 'F', 'A-', '0987654321', 'jane@example.com', '456 Oak Ave', '2023-02-14')`);
                
                db.run(`INSERT INTO BLOOD_BANK (bank_name, location, contact_phone, email, capacity) 
                        VALUES ('City Central Blood Bank', 'Downtown', '1112223333', 'bank@citycentral.com', 5000)`);
                
                db.run(`INSERT INTO HOSPITAL (hospital_name, location, contact_phone, email) 
                        VALUES ('General Hospital', 'Uptown', '5556667777', 'contact@generalhospital.com')`);

                db.run(`INSERT INTO BLOOD_INVENTORY (bank_id, blood_group, quantity_units, collection_date, expiry_date, status) 
                        VALUES (1, 'O+', 50, '2023-10-01', '2023-11-10', 'Available')`);

                db.run(`INSERT INTO DONATION (donor_id, bank_id, donation_date, quantity_ml, blood_group, hepatitis_test, hiv_test, test_results) 
                        VALUES (1, 1, '2023-10-01', 450, 'O+', 'Negative', 'Negative', 'Safe/Available')`);

                db.run(`INSERT INTO BLOOD_REQUEST (hospital_id, bank_id, blood_group, units_requested, request_date, urgency, status) 
                        VALUES (1, 1, 'O+', 10, '2023-10-15', 'High', 'Pending')`);

                db.run(`INSERT INTO RECIPIENT (hospital_id, first_name, last_name, dob, blood_group, gender, phone, email, address, admission_date) 
                        VALUES (1, 'Alice', 'Johnson', '1975-11-30', 'O+', 'F', '3334445555', 'alice@example.com', '789 Pine Rd', '2023-10-14')`);
            }
        });
    });
}

module.exports = db;
