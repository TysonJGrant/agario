#Agario copy




==Steps==

Go to directory of project
npm init - to setup node dependencies and json file with project information

npm i socket.io - add socket.io to project for real time distributed communication

npm i --save-dev nodemon - nodemon creates a server that refreshes automatically

add ("start": "nodemon server.js") to package.json file

now a nodemon server on server.js will run when 'npm run start' is called

server.js - server side code
script.js - client side code

==Git reminder==
go to directory of project

git init - initialises a local git repo. creates hidden git folder.

git add . - tracks all untracked files ready to commit

git status - shows files and staging information

then:

git commit - opens vim editor. type change description. click esc to exit insert
mode and type :wq to process commit

git commit -m "comment" - skips the editor stage and just commits with the comment 
