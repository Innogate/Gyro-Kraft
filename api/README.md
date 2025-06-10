# ADD .htaccess
```conf
RewriteEngine On

# Allow Authorization header
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1

# Skip rewriting if it's an existing file or directory
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Rewrite everything to index.php
RewriteRule ^ index.php [QSA,L]

; angular
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Don't rewrite requests to /control
  RewriteCond %{REQUEST_URI} ^/control [NC]
  RewriteRule ^ - [L]

  # Don't rewrite existing files or folders
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  # Rewrite all other requests to index.html
  RewriteRule . /index.html [L]
</IfModule>



```

# PAGE IDS
1. User Master
2. OderSheet
3. Permission
4. Cutter Master