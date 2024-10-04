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
