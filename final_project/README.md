# Express Book Reviews

## Run
From this `final_project` folder:
```bash
npm install
npm start
```
Server: `http://localhost:5000`

## Public endpoints
- `GET /` — all books
- `GET /isbn/:isbn` — one book
- `GET /author/:author` — author search
- `GET /title/:title` — title search
- `GET /review/:isbn` — reviews for a book
- `POST /register` — create an account

## Authenticated endpoints
- `POST /customer/login` — login and receive a JWT
- `PUT /customer/auth/review/:isbn` — add/update your review
- `DELETE /customer/auth/review/:isbn` — delete your review

Send `Authorization: Bearer YOUR_TOKEN` to authenticated review endpoints.

## cURL examples
```bash
curl http://localhost:5000/
curl http://localhost:5000/isbn/8
curl http://localhost:5000/author/Jane%20Austen
curl http://localhost:5000/title/Pride
curl http://localhost:5000/review/8

curl -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"username":"student1","password":"pass123"}'
curl -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d '{"username":"student1","password":"pass123"}'
```
Use the actual `accessToken` returned by your login command:
```bash
curl -X PUT http://localhost:5000/customer/auth/review/8 -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d '{"review":"A thoughtful and memorable novel."}'
curl -X DELETE http://localhost:5000/customer/auth/review/8 -H "Authorization: Bearer YOUR_TOKEN"
```

## Task 11
`router/general.js` exports Axios async/await helpers under `bookApi`:
`getAllBooks()`, `getBookByISBN(isbn)`, `getBooksByAuthor(author)`, and
`getBooksByTitle(title)`. They call `http://localhost:5000` by default.

## Important
The starter dataset uses keys `1` to `10` as ISBN identifiers. Accounts and reviews are
stored in memory and reset when the server restarts. Run the commands yourself and
capture genuine terminal screenshots for the required evidence; do not submit sample
output as if it were your own run.
