# CBT Admin Panel

## Overview
The CBT (Computer-Based Test) Admin Panel is a web-based interface that allows administrators to create and manage timed exams, add questions and answers, register candidates, and view test results. The platform ensures efficient exam management with real-time monitoring and reporting features.

## Features
- **Exam Management:** Create and schedule timed exams
- **Question Bank:** Add, update, and delete questions and answers
- **Candidate Management:** Register and manage candidates
- **Result Tracking:** View and analyze candidate performance
- **Real-Time Monitoring:** Track ongoing exams and submissions
- **Role-Based Access:** Secure admin authentication

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16.x)
- npm or yarn
- PostgreSQL (if using a database backend)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/cbt-admin-panel.git
   cd cbt-admin-panel
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Start the development server:
   ```sh
   npm start  # or yarn start
   ```

## Deployment
### Docker
1. Build and run the container:
   ```sh
   docker-compose up --build
   ```

### Vercel/Netlify
1. Deploy using Vercel:
   ```sh
   vercel deploy
   ```
2. Deploy using Netlify:
   ```sh
   netlify deploy
   ```

## Environment Variables
Create a `.env` file and configure the following:
```
REACT_APP_API_BASE_URL=https://api.cbt-platform.com
REACT_APP_SOCKET_URL=wss://api.cbt-platform.com/socket
```

## API Endpoints
### Exams
- `POST /api/v1/exams` - Create a new exam
- `GET /api/v1/exams` - Retrieve all exams
- `GET /api/v1/exams/:id` - View a specific exam
- `PUT /api/v1/exams/:id` - Update exam details
- `DELETE /api/v1/exams/:id` - Remove an exam

### Questions
- `POST /api/v1/questions` - Add a new question
- `GET /api/v1/questions` - Fetch all questions
- `PUT /api/v1/questions/:id` - Update a question
- `DELETE /api/v1/questions/:id` - Remove a question

### Candidates
- `POST /api/v1/candidates` - Register a candidate
- `GET /api/v1/candidates` - Retrieve candidate list

### Results
- `GET /api/v1/results` - View all results
- `GET /api/v1/results/:candidate_id` - View results for a specific candidate

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

## License
This project is licensed under the MIT License.

