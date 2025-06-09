# NC News Project: Modularisation & Clean Code To-Do List

## General Principles
- [ ] Move validation and repetitive logic into utility functions or middleware
- [ ] Keep controllers focused on orchestration (calling utils/models, sending responses)
- [ ] Keep models focused on DB logic only

## Suggestions for Modularisation

### 1. Validation Middleware
- [ ] Create a generic middleware for required fields in POST/PATCH requests (e.g. `requireFields(['username', 'body'])`)
- [ ] Use this middleware in your routes to keep controllers clean

### 2. Utility Functions
- [ ] Centralise type checks and value checks (e.g. `ensurePresent`, `isNumber`, etc.) in `utils/`
- [ ] Use these utilities in controllers instead of inline checks

### 3. Error Handling
- [ ] Ensure all custom errors are thrown from utils/models, not controllers
- [ ] Controllers should only catch and forward errors to middleware

### 4. Route Structure
- [ ] Define all route handlers in router files, not in `app.js`
- [ ] Use `apiRouter` to mount resource routers (articles, users, topics, etc.)

### 5. Testing
- [ ] Add/maintain tests for validation middleware and utils
- [ ] Ensure tests cover both valid and invalid requests for all endpoints

---

## Preferences
- [ ] Prioritise modular, reusable code over perfect code
- [ ] Refactor for clarity only after core features and bugs are fixed
- [ ] Use this to-do list to track improvements, not to block progress

---

*Update this list as you go! Focus on features and bugfixes first, then refactor for modularity and cleanliness as time allows.*
