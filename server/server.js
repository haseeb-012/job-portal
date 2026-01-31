import { clerkMiddleware } from '@clerk/express'
import * as Sentry from "@sentry/node"
import bodyParser from 'body-parser'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import connectCloudinary from './config/cloudinary.js'
import connectDB from './config/db.js'
import './config/instrument.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'


// Initialize Express
const app = express()

// Connect to database
connectDB()
await connectCloudinary()

// Middlewares
const allowedOrigins = [
	'http://localhost:5173',
	'https://jobsportal.haseebdevs.site',
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin 
    if (allowedOrigins.includes(origin)|| !origin) {
      callback(null, true)
    }
    else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}))
app.use(express.json())
app.use(clerkMiddleware())

// Raw body parser for webhooks
app.use('/webhooks', bodyParser.raw({ type: 'application/json' }));

// Routes
app.get('/', (req, res) => res.send("API Working"))
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.post('/webhooks', clerkWebhooks)
app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)

// Port
const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})