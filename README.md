# Sortify

A simple web app to achieve some custom spotify activities.

Available features:
- Nothing yet

Future features:
- Display all unsorted tracks
- Auto add sorted tracks to personal library
- List all subscribed artists and new tracks from them
- Make coffee and mow the lawn

## Project setup

```
# Install all dependencies
npm install
```

## Client side (VueJS)

```
# Move to client folder
cd client
npm run serve
```

Opens the home page on http://localhost:8080.

## Run server (NestJS)

### First steps

You can use the VSCode configuration present in launch.json.
It starts the server on http://localhost:3000 by default.

```
TODO: waiting for npm command to run server
```

### .env configuration

In the server/ folder, add a .env file which contains:


> client_id=<span style="color:#57ced3">\<the spotify api client_id\></span>  
> client_secret=<span style="color:#57ced3">\<the spotify api client_secret\></span>  
> jwt_key=<span style="color:#57ced3">\<your own jwt secret key\></span>  
> scopes=<span style="color:#57ced3">\<spotify scopes for user authorization\></span>  
> SERVER_PORT=<span style="color:#57ced3">\<server port\></span> 3000 by default  


