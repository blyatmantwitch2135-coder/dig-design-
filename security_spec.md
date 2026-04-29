# Security Spec

## 1. Data Invariants
- A user can only read and write their own profile document and tasks.
- A task must have a valid title, due date, estimated time, and priority.
- Only the owner (`userId` matching `request.auth.uid`) can create or update a task.

## 2. The "Dirty Dozen" Payloads
1. Unauthorized Profile Read: Unauthenticated user trying to read a profile
2. Unauthorized Profile Edit: Authenticated user A trying to edit user B's profile
3. Unauthorized Task Read: Authenticated user A trying to read user B's tasks
4. Unauthorized Task Edit: Authenticated user A trying to edit user B's tasks
5. Invalid Title: Title is empty on a new Task
6. Invalid Type: EstimatedTime is a string instead of a number
7. Invalid Priority: Priority is "Urgent" instead of "Low", "Medium", "High"
8. Missing Field: Creating a task without a priority
9. Shadow Fields: Creating a task with an extra `isAdmin: true` field.
10. ID Poisoning Guard: Task ID has strange spaces or symbols `!@#$`.
11. Temporal Integrity: `createdAt` is spoofed to a past or future date instead of `request.time`.
12. Identity Integrity: Updating tasks but passing a `userId` that differs from auth UID.
