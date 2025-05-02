# Lightweight PHP Framework with Docker

This project is a minimal PHP framework built to support modular routing, MySQL database access via PDO, and Dockerized development environment. It includes support for `.htaccess`-based routing, a registered routing system (`register_path`), and configuration through a `config.json` file.

---

## 🚀 Features

- Lightweight custom PHP framework
- Register PHP routes like `register_path("GET", "/")`
- HTML file response support for static GET routes
- PDO-based database connection using `Database` class
- MySQL/MariaDB support
- Apache mod_rewrite enabled
- Custom user `vscode` with dotfiles support
- Dockerized for isolated development

---

## 📁 Project Structure

```
project-root/
├── core/                     # Framework core (routing, database, utils)
│   └── framework.php
│   └── Database.php
├── public/                   # Public-facing files (index.php, routes)
│   └── index.php
│   └── welcome.php
├── config.json               # Configuration for DB connection, etc.
├── docker/
│   └── dotfiles/
│       └── php/              # Dotfiles for 'vscode' user (.bashrc, etc.)
├── php.dockerfile            # Dockerfile for PHP server
├── docker-compose.yml        # Compose file to run PHP + MariaDB
└── README.md
```

---

## 🛠 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://your-repo-url
cd your-project
```

### 2. Configuration

Edit `config.json`:

```json
{
  "host": "db",
  "user": "root",
  "pass": "your-password",
  "db": "your-database"
}
```

### 3. Build & Run the Containers

```bash
docker-compose up --build
```

PHP server will be available at: [http://localhost:8080](http://localhost:8080)

MariaDB will be available on: `localhost:3306` (internal hostname: `db`)

---

## 👨‍💻 Development Notes

- Add routes in `public/index.php` using `register_path("GET", "/route", callback)`
- Add static HTML routes using the registration system
- PDO object accessible via `$dbInstance->pdo`

---

## 🧪 Example Route

```php
register_path("GET", "/", function () {
    return "<h1>Welcome to Lightweight PHP Framework</h1>";
});
```

---

## 🐳 Docker PHP Container Includes:

- PHP 8.2
- Apache with mod_rewrite
- Custom user `vscode` (group: `www-data`, home: `/home/vscode`)
- Dotfiles copied from `docker/dotfiles/php`

---

## 🤝 License

MIT License — Free for commercial and personal use.


## Author
```bash
Dev: tuhin-su
Github: @tuhin-su
Date: 02/05/2025
```