# Security Specification - Blog Stats

## 1. Data Invariants
- `blog_stats/{blogId}` contains the view count.
- `views` must be an integer >= 0.
- `updatedAt` must be set to the current request time.
- Any authenticated user (including anonymous) can increment the count.

## 2. The "Dirty Dozen" Payloads
1. `{"views": -1, "updatedAt": "2023-01-01T00:00:00Z"}` - Negative views.
2. `{"views": "many", "updatedAt": "request.time"}` - Invalid type for views.
3. `{"views": 100, "updatedAt": "2023-01-01T00:00:00Z"}` - Forged timestamp.
4. `{"views": 1, "updatedAt": "request.time", "extra": "poison"}` - Extra field (Ghost Field).
5. `{"views": 1}` - Missing required field `updatedAt`.
6. `{"updatedAt": "request.time"}` - Missing required field `views`.
7. `{"views": 1000000000000, "updatedAt": "request.time"}` - Unrealistic jump in views (though hard to block without previous state check).
8. `{"views": 1, "updatedAt": "request.time"}` - Sent by unauthenticated user (if restricted).
9. `{"views": 1, "updatedAt": "request.time"}` - Malicious ID (poison ID).
10. `{"views": true, "updatedAt": "request.time"}` - Wrong type.
11. `{"views": 1, "updatedAt": "request.time"}` - Attempting to overwrite a terminal state (if we had one).
12. `{"views": 1, "updatedAt": "request.time"}` - Bypassing `isValidId` on `blogId`.

## 3. Test Runner
(Will be implemented in firestore.rules.test.ts)
