## Installation

1. Clone this repo.

2. Go inside folder `./docker` and run `docker compose up -d` to start containers.

3. Inside the `php` container, run `composer install` to install dependencies from `/var/www/symfony` folder.

4. Use the following value for the DATABASE_URL environment variable:

```
DATABASE_URL=mysql://root:root@db:3306/calendar?serverVersion=8.0.33
```
5. Go inside ui folder and run `npm install` to install dependencies.

6. Run `npm run dev` to build assets.