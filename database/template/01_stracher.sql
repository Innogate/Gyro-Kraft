CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    address TEXT,
    phone_no VARCHAR(20),
    whatsapp_no VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    photo LONGTEXT,
    password_hash VARCHAR(255),
    disabled BOOLEAN DEFAULT FALSE,
    role ENUM(
        'Super Admin',
        'Manager',
        'Normal user'
    ),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_rights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    module_name VARCHAR(50),
    can_add BOOLEAN,
    can_edit BOOLEAN,
    can_delete BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE cutters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    address TEXT,
    phone_no VARCHAR(20),
    jobber_type VARCHAR(50),
    gst_no  VARCHAR(15),
    srcore INT(11),
    status BOOLEAN DEFAULT 1
);

CREATE TABLE printers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    address TEXT,
    phone_no VARCHAR(20),
    whatsapp_no VARCHAR(20),
    status BOOLEAN DEFAULT 1
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    style_no VARCHAR(100),
    description TEXT,
    age_group VARCHAR(100) DEFAULT NULL,
    pattern TEXT,
    order_date DATE,
    buyer VARCHAR(100),
    brand VARCHAR(100),
    season VARCHAR(100),
    shipment_date DATE,
    documents TEXT,
    remark TEXT
);

CREATE TABLE order_po_qty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    combo VARCHAR(100),
    pro_color VARCHAR(100),
    fabric_quality VARCHAR(100),
    supplier VARCHAR(100),
    preemie INT,
    nb INT,
    total_qty INT
);

CREATE TABLE bom (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    description TEXT,
    fabric VARCHAR(100),
    colour VARCHAR(50),
    tpx VARCHAR(50)
);

CREATE TABLE cutting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    date DATE,
    cutter_id INT,
    lot_no VARCHAR(100),
    total_qty INT,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (cutter_id) REFERENCES cutters (id)
);

CREATE TABLE cutting_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cutting_id INT,
    age_group_id INT,
    qty INT,
    FOREIGN KEY (cutting_id) REFERENCES cutting (id) 
);

CREATE TABLE printing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    date DATE,
    challan_no VARCHAR(100),
    printer_id INT,
    screen_no VARCHAR(100),
    screen_qty INT,
    delivery_date DATE,
    received_qty INT,
    remark TEXT,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (printer_id) REFERENCES printers (id)
);

CREATE TABLE production_stage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    stage ENUM(
        'Stitch',
        'Button',
        'Finishing',
        'Packing'
    ),
    date DATE,
    lot_no VARCHAR(100),
    total_qty INT,
    remark TEXT,
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    sent BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    otp VARCHAR(6),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);