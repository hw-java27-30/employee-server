# employee-server

REST API for account and role management. Built with Node.js + Express + MongoDB Atlas.  
OpenAPI/Swagger documentation is available after the server starts.

[![Node.js](https://img.shields.io/badge/node-%E2%89%A520.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-API-black.svg)](#)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](#)

---

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
    - [Environment Variables](#environment-variables)
    - [Install](#install)
    - [Run in Development](#run-in-development)
    - [Build & Run in Production](#build--run-in-production)
    - [Test](#test)
- [Endpoints](#endpoints)
- [Project Structure](#project-structure)
- [License](#license)

---

## Introduction

`employee-server` is an authentication and account management service with a role-based access model:

- Registration / Login
- Roles: `user`, `premium`, `admin`
- Route access restricted by roles and (optionally) resource ownership checks
- Swagger UI to explore and test the API

**Default base URL:** `http://localhost:3555`

---

## Tech Stack

**Runtime & Framework**

- **Node.js 20+**, **Express 5.1** — HTTP server, routing, middleware.

**Database & ODM**

- **MongoDB Atlas**, **Mongoose 8.18** — schema-based models, validation, queries.

**Auth & Security**

- **jsonwebtoken 9.0** — issue/verify JWT access tokens.
- **bcrypt 6.0** / **bcryptjs 3.0** — password hashing (native vs pure JS fallback).
- **joi 18.0** — request payload validation (schemas).
- **dotenv 17.2** — environment variables from `.env`.

**Logging & Observability**

- **winston 3.17** — application logs (levels/transports).
- **morgan 1.10** — HTTP request logging middleware.

**API Docs**

- **swagger-ui-express 5.0** — serves Swagger UI for your OpenAPI spec (e.g., `/api/docs`).

**Utilities**

- **uuid 8.3** — RFC 4122 IDs (e.g., `v4()`).
- **short-unique-id 5.3** — compact, URL-friendly IDs/codes.

**TypeScript**

- **@types/express 5.0** — Express type definitions for TS.

---

## Getting Started

### Environment Variables

Create a **`.env`** file with:

```env
# Database (MongoDB Atlas)
# Example for Atlas — fill in your credentials/host/appName
MONGO_URI=mongodb+srv://<USER>:<PASSWORD>@<HOST>/<DB_NAME>?retryWrites=true&w=majority&appName=<APP_NAME>

# Authentication
JWT_SECRET=<replace-with-strong-secret>
JWT_EXP=1h
```

### Install

`npm install`

### Run in Development

`npm run dev` — run in watch mode via **tsx** (`src/app.ts dev`).

### Build & Run in Production

`npm start` — clean build (`rimraf ./build`) → compile (`tsc`) → run `node ./build/src/app.js`.

### Test

`npm test` — run Jest with `jest.config.ts`.

---
## Endpoints


#### skipRoutes: 
```
"POST/accounts/login"
```

#### pathRoles:
```
"POST/accounts/": ["admin"],
"DELETE/accounts/": ["admin"],
"PATCH/accounts/": ["user", "premium"],
"PATCH/accounts/password": ["user", "premium"],
"GET/accounts/": ["admin"],
"GET/accounts/employee": ["user", "premium", "admin"],
"PATCH/accounts/set_role": ["admin"],
"GET/accounts/pages": ["admin"],
"GET/accounts/tabNum": ["user", "premium", "admin"],


"GET/shift/start_shift/:table_num": ["user", "premium"],
"GET/shift/finish_shift/:table_num": ["user", "premium"],
"GET/shift/break": ["user", "premium"],
"POST/shift/correctShift": ["admin"],
"GET/shift/currentShift/:table_num": ["user", "premium", "admin"],
```

---
## Project Structure
```text
employee-server/
├─ app-config/
│  └─ app-config.json           
├─ docs/
│  └─ openapi.json                                   
├─ src/
│  ├─ app.ts                   
│  ├─ server.ts                   
│  ├─ config/
│  │  └─ timeControlConfig.ts     
│  ├─ controllers/
│  │  ├─ accountController.ts    
│  │  └─ crewShiftController.ts  
│  ├─ routes/
│  │  ├─ accountRouter.ts        
│  │  └─ crewShift.ts            
│  ├─ services/
│  │  ├─ accountingService/
│  │  │  ├─ AccountService.ts            
│  │  │  └─ AccountServiceMongoImpl.ts   
│  │  └─ ShiftService/
│  │     ├─ CrewShiftService.ts          
│  │     └─ CrewShiftServiceMongoImpl.ts 
│  ├─ model/
│  │  ├─ Employee.ts               
│  │  ├─ EmployeeMongoModels.ts    
│  │  ├─ CrewShift.ts              
│  │  └─ CrewShiftMongoModels.ts   
│  ├─ utils/
│  │  ├─ Roles.ts                 
│  │  └─ tools.ts                 
│  ├─ errorHandler/
│  │  ├─ errorHandler.ts          
│  │  └─ HttpError.ts             
│  ├─ Logger/
│  │  └─ winston.ts               
│  └─ validation/                 
└─ tests/
   └─ unit/
      ├─ accountTests/
      │  ├─ changePassword.test.ts
      │  ├─ fireEmployee.test.ts
      │  ├─ getEmployeeById.test.ts
      │  ├─ hireEmployee.test.ts
      │  ├─ setRole.test.ts
      │  └─ updateEmployee.test.ts
      └─ shiftTests/
         ├─ finishShift.test.ts
         └─ startShift.test.ts
```
---
## License


Copyright (c) 2025 Egor G.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
