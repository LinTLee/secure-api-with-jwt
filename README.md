# Secure Express API with JWT

## Introduction

This project demonstrates how to secure an express server with JWT. It uses a single sign-on cloud-based platform at Auth0 (https://auth0.com) as an Idp. It offers the following 2 key routes:

**POST /login**

Authenticates the given credential against Idp and returns a JWT.

**GET /me**

Requires a valid JWT in header's bearer token and displays the user id decrypted from the provided JWT.

## Getting Started

These instructions would get a copy of this project up and running on your local machine for development and testing purposes. 

### Prerequisites

Install Node environment LTS from https://nodejs.org/en/

### Run the Project

1. Download this respository

2. Fill in your auth0 tenant's parameters to index.js

3. Install node modules
```
npm install
```

4. Start a local express server at http://localhost:8080
```
npm start
```