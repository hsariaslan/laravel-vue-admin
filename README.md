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


## Vue Frontend Setup

```bash
# change directory to client
$ cd client

# install dependencies
$ npm install

# copy .env.example file into .env
$ cp .env.example .env

# compiles and hot-reloads for development under localhost:8080
$ npm run serve
```


## License

Laravel Vue Admin is licensed under the [MIT license](https://opensource.org/licenses/MIT).