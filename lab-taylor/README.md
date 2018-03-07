# Basic Auth

This is a simple, single resource api. It's only resource at this point is a User resource that has a few properties on it, `username`, `email`, and `password`. The plain text password is never saved directly to the database.

## Packages

This app has several dependencies...

 - `bcrypt`
 - `body-parser`
 - `cors`
 - `debug`
 - `dotenv`
 - `express`
 - `http-errors`
 - `jsonwebtoken`
 - `morgan`
 - `mongoose`

 Dev Dependencies

  - `jest`
  - `eslint`
  - `superagent`

## Routes

As this is a rolling application, the only resource at the moment is a User resource, and its only supported http methods are POST and GET

#### GET

The get route for users can be hit at...
```
http://localhost:3000/api/login
```

For galleries... 
```
http://localhost:3000/api/gallery/<galleryid>
```

#### POST

The post route for users can be hit at...
```
http://localhost:3000/api/signup
```

For galleries
```
http://localhost:3000/api/gallery
```

#### PUT 

The route for updating galleries is ...
```
http://localhost:3000/api/gallery/<galleryId>
```

#### DELETE

The route to delete galleries
```
http://localhost:3000/api/gallery/<galleryId>
```