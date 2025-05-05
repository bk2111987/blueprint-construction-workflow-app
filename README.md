# Blueprint App

A construction industry workflow management application connecting contractors, vendors, subcontractors, and customers.

## Features

### Contractors
- Create and manage projects with timelines, budgets, and tasks
- Post projects for bidding
- Compare bids side-by-side
- Upload permits and blueprints
- Set payment milestones
- Receive license/permit expiration alerts
- In-app chat with subcontractors

### Vendors
- List materials with real-time inventory
- Receive RFQ notifications
- Generate quotes
- Track payment statuses
- ERP integration for stock updates
- Dispute resolution system

### Subcontractors
- Search projects by trade/location
- Submit bids
- Showcase certifications
- Track milestone payments
- Receive bid deadline alerts
- Update availability status

### Customers
- Post renovation tasks
- Compare contractor reviews
- Track project progress
- Approve/reject project changes
- Rate contractors

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL with Sequelize ORM
- Socket.io for real-time communication
- JWT authentication with 2FA support
- Bilingual support (English/French)

### Frontend
- React with React Router
- Tailwind CSS for styling
- Font Awesome icons
- Google Fonts
- Context API for state management

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a .env file with the following variables:
\`\`\`
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/blueprint_db
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
\`\`\`

4. Start the server:
\`\`\`bash
npm run dev
\`\`\`

### Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

The application will be available at http://localhost:3000

## API Documentation

### Authentication Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login
- POST /api/auth/verify-2fa - Verify 2FA code
- POST /api/auth/reset-password - Request password reset
- PATCH /api/auth/language - Update user language preference
- DELETE /api/auth/account - Delete user account

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
