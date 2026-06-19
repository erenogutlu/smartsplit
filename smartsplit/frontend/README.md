#  SmartSplit - Modern Expense Sharing App

SmartSplit is a full-stack, secure, and intuitive web application designed to help friends, roommates, and colleagues split bills and track shared expenses effortlessly.

Built with an industry-standard architecture, it features robust **JWT Authentication**, real-time **Balance Calculation**, and a personalized **User Dashboard**.

##  Key Features

*  Secure Authentication:  Complete Login/Register flow protected by Spring Security and JSON Web Tokens (JWT).
* Personalized Dashboard: Users are greeted with a customized summary of their current financial status (Owes vs. Gets).
* Expense Categorization: Tag expenses with categories (Food, Transport, Utilities) using Java Enums.
* Smart Settlement: Advanced algorithm to handle "Settle Up" transactions between debtors and creditors.
* Responsive UI: A clean, component-based React frontend built for seamless user experience.

##  Tech Stack

**Backend (The Engine):**
* Java 21 & Spring Boot 3.x
* Spring Security & JJWT (JSON Web Token)
* Spring Data JPA & Hibernate
* PostgreSQL (Database)
* JUnit (Unit Testing)

**Frontend (The Interface):**
* React.js (Hooks, Functional Components)
* LocalStorage (Token Management)
* Standard CSS

##  How to Run Locally

### 1. Database Setup
Ensure PostgreSQL is running on your machine. Create a new database named `smartsplit`.

### 2. Backend Setup
1. Navigate to the `backend` folder.
2. Open `src/main/resources/application.properties` and update your database credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/smartsplit
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD