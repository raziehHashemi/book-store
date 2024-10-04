# Book Store Project

## Summary
The Book Store project is a web application designed to facilitate the buying books. It provides users with a platform to browse, search, and purchase books.

<!--
This section provides a overview of the Book Store project technologies used.
-->
## Technologies
    - Built using Node.js and Express.js.
    - Uses a non-relational database MongoDB.
    - Secures endpoints using JWT (JSON Web Tokens) for authentication.

## Container Layer Diagram
![alt][container.png](https://github.com/raziehHashemi/book-store/blob/main/container.png)

## Architecture
The architecture of the Book Store project is based on microservices:

1. **User Service**:
    - Manages users signup and handles user authentication.
    - Generates JWT tokens for authentication.
    - Interacts with purcahse service via microservice.

2. **Book Service**:
    - Manages books inventory and provides search functionality.
    - Interacts with purcahse service via microservice.
    - Caches popular books data for faster retrieval.

3. **Purchase Service**:
    - Handles book orders and payment processing.
    - Interacts with user and book srvice via microservice.
    - Secures endpoints using JWT (JSON Web Tokens) for authentication.


## Setup
To run the Book Store project, follow these steps:
`git clone <repository_url>`
`cd <repository_name>`

1. **User Service**:
    - `cd user-service`
    - `npm install`

2. **Book Service**:
    - `cd book-service`
    - `npm install`
  
3. **Purchase Service**: 
    - `cd purchase-service`
    - `npm install`
  
then put this values in .env file in each service:
```
PORT=3000 ## for book-service
PORT=3001 ## for user-service
PORT=3002 ## for purchase-service
DB_URI=mongodb://localhost:27017/bookstore
RABIT_URL=amqp://guest:guest@message-broker:5672
JWT_SECRET_KEY=secret ## it can be any string
JWT_EXPIRATION_TIME=1d
REDIS_HOST=redis
REDIS_PORT=6379
SWAGGER_SERVER=localhost
SWAGGER_ENV=development ## it can be production
### for purchase-service
BOOKS_SERVICE_HOST=http://localhost
BOOKS_SERVICE_PORT=3000
USER_SERVICE_HOST=http://localhost
USER_SERVICE_PORT=3001
```
4. **Build and Run Docker Containers**:
    - `docker-compose up --build`
  
5. **Access the RabbitMQ Management UI (Optional)**:
    - Open a web browser and go to `http://localhost:15672`.
    - Log in using the default credentials: `guest` for both username and password.
    - You can monitor the message queues and exchanges from the RabbitMQ management UI.
  
6. **Access the Book Service API Documentation**: 
    - Open a web browser and go to `http://localhost:3000/open-apis` to view the Swagger API documentation for the Book Store project.

7. **Access the User Service API Documentation**:
    - Open a web browser and go to `http://localhost:3001/open-apis` to view the Swagger API documentation for the Book Store project.

8. **Access the Purchase Service API Documentation**:
    - Open a web browser and go to `http://localhost:3002/open-apis` to view the Swagger API documentation for the Book Store project.

9. **Tear Down Docker Containers**:
    - `docker-compose down`


## My Interpretation of the Project
The Book Store project is a simple web application that allows users to browse, search, and purchase books. It consists of three microservices: User Service, Book Service, and Purchase Service. The User Service handles user authentication and signup, while the Book Service manages the books inventory and provides search functionality. The Purchase Service handles book orders and payment processing. The services communicate with each other using RabbitMQ message queues. The project uses MongoDB as the database and Redis for caching popular books data. The endpoints are secured using JWT tokens for authentication. 
The most popular books are defined as the most visited books (top 20).
Premium users are defined as users who have discounted prices for books (10 percent).
Just to purchase a book, the user should be logged in.
The books should be added to database before running project (because there is no description to guide me to add book CRUD operations).

## Cache Strategy
The Book Service caches the most popular books data in Redis to improve performance. The cache is updated every time a user visits a book details page. There is an edpoint to get the 20 most popular books.

## Cart Strategy
The Purchase Service handles the cart functionality. The user can add books to the cart, view the cart, complete the books in the cart by doing payment, and remove books from the cart. The cart is stored in the databse. Theere is an array of books in the purchase schema to store the books in the cart. When the user completes the purchase, the books in the cart will be removed from the cart and when the user adds a book to the cart, the status of the cart will be updated to 'pending', and when the user completes the purchase, the status of the cart will be updated to 'completed' or 'canceled' due to payment result. Whenever a book is added to the cart, the total amount of the cart will be updated and if the user has premium role, the total amount will be discounted by 10 percent and save in totalAmountWithDiscount.


<!--
This section outlines potential enhancements and optimizations that can be made to the Book-Store project. It serves as a guide for future development and improvements.
-->
## Possible Improvements

1. **User Roles**:
    - Implement user roles to differentiate between regular users and admin users.
    - Admin users can manage books inventory and user orders.

2. **Order History**:
    - Add order history functionality for users to view their past orders.

3. **Payment Gateway**:
    - Integrate with a payment gateway to handle real payments.
    - Implement a payment service to handle payment processing.
    - Add support for multiple payment methods.
    - Add queueing mechanism for processing payments asynchronously.
    - Add refund functionality.

4. **Product Reviews**:
    - Allow users to leave reviews and ratings for books.
    - Display average rating for each book.

5. **Book Recommendations**:
    - Implement a recommendation system to suggest books to users based on their purchase history.

6. **General Cart**:
    - Implement a general cart system that allows users to add any products by implementing product interface.

7. **Better Validation**:
    - Implement more robust validation for user inputs.

8. **Testing**:
    - Add more unit and integration tests.

9. **Error Handling**:
    - Implement centralized error handling middleware.

## Challenges
Learning RabbitMQ and integrating it into the existing architecture will require additional time and effort.