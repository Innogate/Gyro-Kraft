# check vendor folder exsit or not
if [ ! -d "./vendor" ]; then
    composer install
fi
php -S 0.0.0.0:80 -t /app