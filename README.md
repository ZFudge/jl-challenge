Requires Make, docker, pnpm, and curl

Using the template provided in .env-example, create a .env file in the root directory.
Feel free to replace these example settings with your own.

To run the project:

# generate a secret for authentication. this will be stored in your .env file.
make secret

# install node modules
make install

# start PostgreSQL container
make db

# run dev server
make dev

# seed database
make seed

Now, navigate to http://localhost:3000/ and log in with credentials
email: testuser@test.com
pw: pw12345

Alternatively, you can log in with credentials
email: rtimey@business2.com
pw: pw12345
