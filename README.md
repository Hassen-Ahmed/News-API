# News API

# Here is link for API

https://news-api-d5x1.onrender.com/api

# About the this API

The functionality of the news-api project is any one who have access to this
link can Retrieves different kind of data. For instance:-

1- Articles
2- comments
3- topics
4- users

Also this API help the users to access data in different way. For example by using
queries or parameters and also allow with by orders.

# How to clone

To clone this repo in to you machine you can use different way, for know I will show you two ways.
1- DownloaD ZIP file from github = https://github.com/Hassen-Ahmed/News-API.
2- Using link which is provide in github like https://github.com/Hassen-Ahmed/News-API.git.
After that in your machine/laptop terminal write 'git clone https://github.com/Hassen-Ahmed/News-API.git'.

# How to install Dependencies

To install dependencies of this project go to terminal in you machine/laptop and write 'npm install'.

# Seed local database and run test

-There are two seed here one for test and other for development/production.
-Before seed for any of them run 'npm run setup-dbs'.

If you seed for testing just write in the terminal 'npm test' it will auto seed the data to the database_test.
But you seed for development write 'npm run seed'.
For production seeding 'npm run seed-prod'.

# Securer information

For security purpose I created three file
1- .env.test
2- .env.development
3- .env.production
This files have sensetive information about you database, for know only have two information.
1-PGDATABASE
2-DATABASE_URL

# How to create this files

In root of this directory create a file .env.test, .env.development, .env.production.
And for test and development write PGDATABASE=yours_databe_name.
For production write DATABASE_URL=your_database_link.

# Node version and Postgres

It's better alway to update latest Node version for this am at v20.2.0.
Postgres version 14.8
