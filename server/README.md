## Laravel Vue Admin

Admin panel with Laravel backend and Vue frontend

## Laravel Backend Setup

```bash
# change directory to server
$ cd server

# install dependencies
$ composer install

# copy .env.example file into .env then update your database name and database credentials
$ cp .env.example .env

# run migrations and seeds
$ php artisan migrate --seed

# serve at localhost:8000
$ php artisan serve
```