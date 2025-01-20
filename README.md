# searchApp-backend
# README

## Table of Contents
1. [Backend Setup](#backend-setup)
2. [Frontend repo link ] (https://github.com/Rohitszx/searchApp-frontend)
3. [Common Notes](#common-notes)

## Backend Setup
The backend is built with Node.js and communicates with MongoDB for data storage. It also provides both REST and gRPC endpoints.

### Prerequisites
Ensure the following tools are installed on your machine:
- Node.js (v16 or later)
- npm or yarn
- MongoDB (local or cloud-based instance)

### Steps to Setup and Run
1. **Clone the Repository**
   ```bash
   git clone <backend-repository-url>
   cd <backend-directory>
   ```

2. **Install Dependencies**
   Run the following command to install required packages:
   ```bash
   npm install
   # OR
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root of your backend project. Add the following variables:
   ```env
   PORT=3000
   GRPC_PORT=50051
   MONGO_URI=mongodb://localhost:27017/your_database_name
   DB_NAME=questions
   ```
   Update the MongoDB connection string (`MONGO_URI`) and database name (`DB_NAME`) as needed.

4. **Start the Development Server**
   Run the following command to start the backend:
   ```bash
   npm run dev
   # OR
   yarn dev
   ```
   - REST APIs will be available at `http://localhost:3000`.
   - gRPC server will be running on `localhost:50051`.

5. **Build for Production**
   To create an optimized build for deployment:
   ```bash
   npm run build
   # OR
   yarn build
   ```

6. **Run the Production Server**
   After building, run the production server with:
   ```bash
   npm start
   # OR
   yarn start
   ```

---

## Common Notes
- **Frontend-Backend Communication**:
  - Ensure the `REACT_APP_BACKEND_URL` in the frontend `.env` file matches the backend REST API endpoint.
  - Ensure the `REACT_APP_GRPC_URL` matches the gRPC server address.

- **MongoDB Configuration**:
  - Ensure MongoDB is running locally or use a cloud-based MongoDB instance.
  - If using authentication, update the `MONGO_URI` with the correct username and password.

- **Cross-Origin Resource Sharing (CORS)**:
  - The backend has CORS configured to allow requests from all origins. Modify this if you need to restrict access.

- **Logging**:
  - The backend logs important events using a custom logger. Check the `logs` directory or console for debugging information.

