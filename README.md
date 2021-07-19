
# Installation
- Clone the repository
```
git clone https://github.com/delila94/mongo-node-JWT-crud.git
```
- Install dependencies
```
npm install
npm run build
```
- Launch demo Node and Mongo server in docker containers
```
docker-compose build
docker-compose up
```

## Step1 : Register a user
Send a POST request to `http://localhost:3000/api/user/register` 
with the following payload ** :
```json
{
	"email": "test@gmail.com",
	"password": "pass"
}
```
You should get a JWT token in the response :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lMiIsImlhdCI6MTU1MDU4MTA4NH0.WN5D-BFLypnuklvO3VFQ5ucDjBT68R2Yc-gj8AlkRAs"
}
```

## Step2 : Create a List of Products
Send a POST request to `http://localhost:3000/api/products` 
with the following payload :
```json
{
  "productId": "13",
  "name": "Grocery-List",
  "list": [{"name":"bread","qty":2},{"name":"milk","qty":20}]
}
Add the JWT token to the Authorization header :
```http
Content-Type: application/json
Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRlc3QuY29tIiwiaWQiOiI2MGVlOGI4NDk2MDUzZDAwOWY4ZTIwODIiLCJpYXQiOjE2MjYzNDUxOTUsImV4cCI6MTYyNjM0ODc5NX0.V2X5mPeTzhNr7r2aTghCr40bMQCC8VzgjiV2kAPb1-g
```
You should have created the list of products !!
```json
"status": 201,
    "data": {
        "_id": "60f150a891eca0006b93376d",
        "name": "Grocery-List",
        "productId": "13",
        "list": [
            {
                "_id": "60f150a891eca0006b93376f",
                "name": "bread",
                "qty": 2
            },
            {
                "_id": "60f150a891eca0006b93376e",
                "name": "milk",
                "qty": 20
            }
        ],
        "userId": "60ee8b8496053d009f8e2082",
        "date": "2021-07-16T09:26:00.562Z",
        "__v": 0
    }
}
```
## Step3 : update product list
Send a PUT request to `http://localhost:3000/api/products/Grocery-List` 
with the following payload to modify just content of list :
```json
{
   "list": [{"name":"beer","qty":4},{"name":"bread","qty":4}]
}
Add the JWT token to the Authorization header :
```http
Content-Type: application/json
Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRlc3QuY29tIiwiaWQiOiI2MGVlOGI4NDk2MDUzZDAwOWY4ZTIwODIiLCJpYXQiOjE2MjYzNDUxOTUsImV4cCI6MTYyNjM0ODc5NX0.V2X5mPeTzhNr7r2aTghCr40bMQCC8VzgjiV2kAPb1-g
```json
"data": {
        "_id": "60f150a891eca0006b93376d",
        "name": "Grocery-List",
        "productId": "13",
        "list": [
            {
                "_id": "60f15a44739d3a01578ef265",
                "name": "beer",
                "qty": 4
            },
            {
                "_id": "60f15a44739d3a01578ef264",
                "name": "bread",
                "qty": 4
            }
        ],
        "userId": "60ee8b8496053d009f8e2082",
        "date": "2021-07-16T09:26:00.562Z",
        "__v": 0
    }
}
```
## Step3 : delete product list
Send a DELETE request to `http://localhost:3000/api/products/Grocery-List` 

Add the JWT token to the Authorization header :
```http
Content-Type: application/json
Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRlc3QuY29tIiwiaWQiOiI2MGVlOGI4NDk2MDUzZDAwOWY4ZTIwODIiLCJpYXQiOjE2MjYzNDUxOTUsImV4cCI6MTYyNjM0ODc5NX0.V2X5mPeTzhNr7r2aTghCr40bMQCC8VzgjiV2kAPb1-g
```json
{
    "response": "Shopping list deleted Successfully"
}
```
## Step4 : create report with specific time interval
Send a POST request to `http://localhost:3000/api/products/createReport` 
with the following payload to specify start and end date which will be used to create report :
```json
{
    "startTime":"2021-06-06",
    "endTime":"2021-07-16"
}
Add the JWT token to the Authorization header :
```http
Content-Type: application/json
Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlRlc3QuY29tIiwiaWQiOiI2MGVlOGI4NDk2MDUzZDAwOWY4ZTIwODIiLCJpYXQiOjE2MjYzNDUxOTUsImV4cCI6MTYyNjM0ODc5NX0.V2X5mPeTzhNr7r2aTghCr40bMQCC8VzgjiV2kAPb1-g

As a response you will get all lists from signed in user with total quantity
```json
{
    "data": [
        {
            "list": [
                {
                    "name": "bread",
                    "totalQty": 13
                },
                {
                    "name": "beer",
                    "totalQty": 15
                },
                {
                    "name": "milk",
                    "totalQty": 81
                }
            ]
        }
    ]
}
```

