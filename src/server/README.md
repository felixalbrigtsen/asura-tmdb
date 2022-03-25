## Server installation
* Clone the repository
** Checkout the "server" branch if not merged
* Enter the server directory: `cd src/server`
* Install the node dependencies: `npm install`
* Create the file `.env` containing your database login:
```
DB_HOST=mysql.stud.ntnu.no
DB_USER=dbusername
DB_PASSWORD=dbpassword
DB_DATABASE=dbname
```
* Build the client (separate instructions)
* Start the server `npm start`
