import express from 'express';
import mongoose from 'mongoose';
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
import dotenv from 'dotenv';
import cors from 'cors';
import process from 'process';
import moment from 'moment';
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
dotenv.config();

const app = express();
app.use(cors({
  credentials: true,
}));

app.use(express.json());

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Define the User schema

// user schema 

const userSchema = new mongoose.Schema({
  isLoggedIn: Boolean,
  sessionId: String,
  name: String,
  email: String,
  uniqueUserId: String,
  picture: String,
});

// transaction schema
const transactionSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  debit: String,
  description: String,
  datetime: Date,
  transactionType: String,
  closingbalance: Number,
});

const Transaction = mongoose.model('Transaction', transactionSchema);



// Define the User model
const User = mongoose.model('User', userSchema);

// Initialize session middleware
const MongoStore = connectMongo(expressSession);
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      httpOnly: false,
    },
    store: new MongoStore({
      mongooseConnection: db,
    }),
  })
);

const authenticateGoogle = async (req, res, next) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.user = payload; // Attach user information to the request object
    next();
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(401).json({ error: 'Google authentication failed' });
  }
};

app.use('/api/authenticateGoogle', authenticateGoogle);
// Handle user login status and store user data in MongoDB
app.post('/api/checkLogin', async (req, res) => {
  const { isLoggedIn, sessionId, name, ...userData } = req.body;
  req.session.isLoggedIn = isLoggedIn;
  req.session.name = name;

  try {
    let user = await User.findOne({ sessionId });

    if (!user) {
      user = new User({ ...userData, sessionId });
      await user.save();
      console.log('New user data saved successfully');
    } else {
      // Update existing user data
      await User.updateOne({ sessionId }, { ...userData });
      console.log('Existing user data updated successfully');
    }

    res.json({ message: 'User data saved successfully' });
  } catch (err) {
    console.error('Error saving/updating user data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle Transactions or transaction API
app.post('/api/userTransactions', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();

    console.log('Transaction data saved successfully');
    res.json({ message: 'Transaction data saved successfully' });
  } catch (err) {
    console.error('Error saving transaction data:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Combined user information route
app.get('/api/getUserInformation', (req, res) => {
  console.log('Session Data:', req.session);
  if (req.session.isLoggedIn) {
    try {
      const {
        name,
        email,
        uniqueUserId,
        picture
      } = req.user; // Assuming user information is attached to the request object during authentication

      let responseData = {};
      const endpointType = req.query.type;

      switch (endpointType) {
        case 'profile':
          responseData = {
            name,
            email,
            uniqueUserId,
            picture
          };
          break;
        case 'name':
          responseData = {
            name
          };
          break;
        case 'status':
          responseData = {
            name,
            isLoggedIn: true
          };
          break;
        default:
          responseData = {
            error: 'Invalid request'
          };
          break;
      }

      res.json(responseData);
    } catch (err) {
      console.error('Error fetching user information:', err);
      res.status(500).json({
        error: 'Internal Server Error'
      });
    }
  } else {
    res.status(401).json({
      error: 'User not logged in'
    });
  }
});




// Fetch transactions with filters route
app.post('/api/fetchTransactions', async (req, res) => {
  try {
    const filters = req.body;

    // Build the query based on filters
    const query = {};
    if (filters.date) {
      query.datetime = { $gte: moment(filters.date).startOf('day'), $lte: moment(filters.date).endOf('day') };
    }

    if (filters.time) {
      // Handle time filter logic based on user selection
      // Modify the query accordingly
    }

    if (filters.transactionType) {
      if (filters.transactionType === 'credit') {
        query.debit = 'credit';
      } else if (filters.transactionType === 'debit') {
        query.debit = 'debit';
      }

      // Handle sub-type filter logic based on user selection
      if (filters.transactionSubType) {
        // Modify the query accordingly
      }
    }

    // Fetch transactions based on the query
    const transactions = await Transaction.find(query);

    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/displayTransactions', async (req, res) => {
  // Check if the user is logged in
  if (!req.session.isLoggedIn) {
    return res.status(401).json({ error: 'User not logged in. Please log in to view transactions.' });
  }

  try {
    // Get the uniqueUserId from the session
    const { uniqueUserId } = req.session;

    // Fetch transactions for the logged-in user
    const transactions = await Transaction.find({ uniqueUserId });

    // Check if there are transactions for the user
    if (transactions.length === 0) {
      return res.json({ message: 'No transactions found for the user.' });
    }

    // Prepare data for tabular display
    const tableData = transactions.map(transaction => ({
      Name: transaction.name,
      Amount: transaction.amount,
      Debit: transaction.debit,
      Description: transaction.description,
      Date: moment(transaction.datetime).format('YYYY-MM-DD HH:mm:ss'),
      TransactionType: transaction.transactionType,
      ClosingBalance: transaction.closingbalance,
    }));

    // Send the tabular data as JSON response
    res.json(tableData);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
