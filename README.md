# Todo Fancy Server

List of routes user:

| **Route** | **HTTP** | **Description** |
|-------|------|-------------|
| /api/signup | POST | Create new user |
| /api/signin | POST | Signin user |
| /api/signin/facebook | POST | Signin user with facebook |

List of routes todo: 

| **Route** | **HTTP** | **Description** |
|-------|------|-------------|
| /api/todo/add | POST | Create new todo |
| /api/todo/mytodolist | GET | Get all todo collection user |
| /api/todo/mytodolist/:todolistId | PUT | Edit todo |
| /api/todo/mytodolist/:todolistId | DELETE | Delete todo |

**Usage**
with only npm: 
```
npm install
npm start
```

Access via website http://localhost:3030/