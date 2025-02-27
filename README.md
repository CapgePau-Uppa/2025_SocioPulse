# 2025_SocioPulse

/----------Download----------/

WINDOWS :


BDD :
REQUIRE : Microsoft Visual C++ Redistributable 
1) https://dev.mysql.com/downloads/installer/
2) mysql-installer-community-8.0.41.0.msi (the second in the list)
3) Setup : "Full"
4) Use all recommended choice
5) Put the folder MySQL\MySQL Server 8.0\bin in the path
6) mysql -u root -p
7) create database laravel;


BACKEND :
REQUIRE : Git
PHP : 
1) https://windows.php.net/download/ and choose download the thread safe
2) Extract the folder and rename it php
3) put in the path the folder /php
4) php --ini 
5) php -v
6) in the php.ini uncomment the "extension=pdo_mysql", "extension=fileinfo" and "extension=openssl"
(if there is a trouble finding php.ini you might have to create it from php.ini-production)

COMPOSER : 
1) getcomposer.org/download
2) download the downloader.exe and follow all steps
3) composer -v


NPM(also used in front end) :
1) https://nodejs.org/
2) Download the last version (LTS)
3) Run the .msi and follow all steps
4) node -v
5) npm -v
6) you might need to do npm install -g npm@11.1.0


FRONTEND :
ANGULAR : 
1) npm install -g @angular/cli
2) ng version


/----------Launch----------/

WINDOWS :


BDD :
1) mysql -u root -p

BACKEND :
1) composer install
2) copy .env.example .env
3) in .env change the DB_PASSWORD (and name if needed. according to your BDD)
4) php artisan migrate --seed
5) php artisan key:generate
6) php artisan serve
Ready in http://localhost:8000/

FRONTEND :
1) npm install
2) ng serve

/----------Seeder----------/

admin@example.com
password

entreprise@example.com
password

citoyen@example.com
password

communaute@example.com
password
