# Job Portal

A full-stack job portal application for job seekers and recruiters.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Scripts](#scripts)
- [License](#license)

## Features

- User authentication
- Job listing and search
- Job application management
- Resume upload and download
- Recruiter dashboard
- Company management

## Project Structure

```
client/
    src/
        components/
            AppDownload.jsx
            Footer.jsx
            Hero.jsx
            JobCard.jsx
            JobListing.jsx
            Loading.jsx
            Navbar.jsx
            RecruiterLogin.jsx
            Resume.jsx
        context/
            AppContext.jsx
        pages/
            AddJob.jsx
            Applications.jsx
            ApplyJob.jsx
            Dashboard.jsx
            Home.jsx
            ManageJobs.jsx
            ScoreJobListing.jsx
            ViewApplications.jsx
server/
    config/
        cloudinary.js
        db.js
        instrument.js
        multer.js
    controllers/
        companyController.js
        jobController.js
        userController.js
        webhooks.js
    middleware/
        authMiddleware.js
    models/
        Company.js
        Job.js
        JobApplication.js
        User.js
    routes/
        companyRoutes.js
        jobRoutes.js
        userRoutes.js
    utils/
        generateToken.js
        getEmbedding.js
    server.js
```

## Setup Instructions

1. **Install dependencies:**

   ```sh
   cd client
   npm install
   cd ../server
   npm install
   ```

2. **Start the development servers:**

   - Client:
     ```sh
     cd client
     npm run dev
     ```
   - Server:
     ```sh
     cd server
     npm start
     ```

## Scripts

- **Client**

  - `npm run dev` - Start the client development server

- **Server**
  - `npm start` - Start the server
  - `npm run sentry:sourcemaps` - Inject and upload Sentry sourcemaps

## License

MIT
