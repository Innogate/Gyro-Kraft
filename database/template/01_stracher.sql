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
    role ENUM('Super Admin', 'Manager', 'Normal user'),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_rights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    module_name VARCHAR(50),
    can_add BOOLEAN,
    can_edit BOOLEAN,
    can_delete BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE age_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE
);

CREATE TABLE cutters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    address TEXT,
    phone_no VARCHAR(20),
    whatsapp_no VARCHAR(20)
);

CREATE TABLE printers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    address TEXT,
    phone_no VARCHAR(20),
    whatsapp_no VARCHAR(20)
);

CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(50) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `buyer` varchar(100) DEFAULT NULL,
  `style_no` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `season` varchar(100) DEFAULT NULL,
  `age_group_id` int(11) DEFAULT NULL,
  `shipment_date` date DEFAULT NULL,
  `pattern` text DEFAULT NULL,
  `printing` text DEFAULT NULL,
  `documents` text DEFAULT NULL,
  `steps_required` text DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `deadline_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`unique_id`),
  KEY `age_group_id` (`age_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci

CREATE TABLE order_po_qty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    combo VARCHAR(100),
    pro_color VARCHAR(100),
    fabric_quality VARCHAR(100),
    supplier VARCHAR(100),
    preemie INT,
    nb INT,
    total_qty INT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE order_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT,
    age_group_id INT,
    article_no VARCHAR(100),
    qty INT,
    gender ENUM('Male', 'Female', 'Unisex'),
    product_photos TEXT,
    FOREIGN KEY (po_id) REFERENCES order_po_qty(id),
    FOREIGN KEY (age_group_id) REFERENCES age_groups(id)
);


CREATE TABLE bom_fabrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    description TEXT,
    fabric VARCHAR(100),
    colour VARCHAR(50),
    tpx VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE bom_accessories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    particular VARCHAR(100),
    specification TEXT,
    shade_no VARCHAR(50),
    consumption VARCHAR(100),
    supplier VARCHAR(100),
    status VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE cutting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    date DATE,
    cutter_id INT,
    lot_no VARCHAR(100),
    total_qty INT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (cutter_id) REFERENCES cutters(id)
);

CREATE TABLE cutting_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cutting_id INT,
    age_group_id INT,
    qty INT,
    FOREIGN KEY (cutting_id) REFERENCES cutting(id),
    FOREIGN KEY (age_group_id) REFERENCES age_groups(id)
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
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (printer_id) REFERENCES printers(id)
);

CREATE TABLE production_stage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    stage ENUM('Stitch', 'Button', 'Finishing', 'Packing'),
    date DATE,
    lot_no VARCHAR(100),
    total_qty INT,
    remark TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    sent BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    otp VARCHAR(6),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);