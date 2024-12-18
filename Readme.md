# Nodejs and Express Assignment

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 22.11.0


# Getting started
- Clone the repository
```
git clone  https://github.com/tanvir-alam-sk/Assignment---3 hotel-management-server
```
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm run dev
```
  Navigate to `http://localhost:8000`

- API Document endpoints

  get-Hotel-By-Id Endpoint : http://localhost:8000/hotel_id 

  post-a-hotel  Endpoint : http://localhost:8000/hotel 

  update-A-Hotel-By-Id Endpoint : http://localhost:8000/hotel_id 

  post-a-Image  Endpoint : http://localhost:8000/images 


# TypeScript + Node 
The main purpose of this repository is to show a project setup and workflow for writing microservice. The Rest APIs will be using the Swagger (OpenAPI) Specification.




## Getting TypeScript
Add Typescript to project `npm`.
```
npm install -D typescript
```

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **src/controllers**      | Controllers define functions to serve various express routes. 
| **src/lib**              | Common libraries to be used across your app.  
| **src/routes**           | Contain all express routes, separated by module/area of application                       
| **src/models**           | Models define schemas that will be used in storing and retrieving data from Application 
| server.ts         | Entry point to express app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | tsconfig.json            | Config settings for compiling source code only written in TypeScript    
| tslint.json              | Config settings for TSLint code style checking                                                |

## Building the project
### Configuring TypeScript compilation
```json
{
    "compilerOptions": {
      "target": "es16",
      "module": "commonjs",
      "outDir": "dist",
      "sourceMap": true
    },
    
    "include": [
      "src/**/*.ts"
      

    ],
    "exclude": [
      "src/**/*.spec.ts",
      "test",
      "node_modules"
    
    ]
  }

```

### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node on dist/index.js. Can be invoked with `npm start`                  |
| `build:dev`                   | Full build. Runs ALL build tasks with all watch tasks        |
| `dev`                   | Runs full build before starting all watch tasks. Can be invoked with `npm dev`                                         |
| `test`                    | Runs build and run tests using mocha        |
| `lint`                    | Runs TSLint on project files       |

## Testing
The tests are  written in Mocha and the assertions done using Chai

```
"jest": "29.7.0",


```
````
| `npm test`                   | For run All test        |

````
Test files are created under __test__ folder.


# Swagger
## Specification
The swagger specification file is named as swagger.yaml. The file is located under definition folder.
Example:
```
paths:
  /hello:
    get:
      x-swagger-router-controller: helloWorldRoute
      operationId: helloWorldGet
      tags:
        - /hello
      description: >-
        Returns the current weather for the requested location using the
        requested unit.
      parameters:
        - name: greeting
          in: query
          description: Name of greeting
          required: true
          type: string
      responses:
        '200':
          description: Successful request.
          schema:
            $ref: '#/definitions/Hello'
        default:
          description: Invalid request.
          schema:
            $ref: '#/definitions/Error'
definitions:
  Hello:
    properties:
      msg:
        type: string
    required:
      - msg
  Error:
    properties:
      message:
        type: string
    required:
      - message
```
## Swagger Middleware
The project is using npm module `swagger-tools` that provides middleware functions for metadata, security, validation and routing, and bundles Swagger UI into Express.
```
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
        // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
        app.use(middleware.swaggerMetadata());

        // Validate Swagger requests
        app.use(middleware.swaggerValidator({}));

        // Route validated requests to appropriate controller
        app.use(middleware.swaggerRouter(options));
       
        // Serve the Swagger documents and Swagger UI
        app.use(middleware.swaggerUi());
        cb();

    })
```
- Metadata

  Swagger extends the Express request object, so that each route handler has access to incoming parameters that have been parsed based on the spec, as well as additional Swagger-generated information from the client.

  Any incoming parameters for the API call will be available in `req.swagger` regardless of whether they were transmitted using query, body, header, etc.

- Validator

  Validation middleware will only route requests that match paths in Swagger specification exactly in terms of endpoint path, request mime type, required and optional parameters, and their declared types.


# Common Issues

## npm install fails
The current solution has an example for using a private npm repository. if you want to use the public npm repository, remove the .npmrc file.


