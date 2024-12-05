const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'wildcard'

const app = express();
const port = 3000;

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Define User model
class User extends Model {}
User.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING
}, { sequelize, modelName: 'user' });

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h'});
};

// Function to verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied, No Token Provided'});
  }
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId; // Add userId to the request object
    next(); // proceed to the next middleware or route handler
  }
  catch (err) {
    return res.status(403).json({ message: 'Invalid or Expired Token'});
  }
};

// Password Hashing before it saves to the database
User.beforeCreate(async (user) => {
  if (user.password) {
    console.log('Hashing password for user:', user.email);
    user.password = await bcrypt.hash(user.password, 10); // Password = Hashed
  }
});

User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Define MoodTracker model
class MoodTracker extends Model {}
MoodTracker.init({
  mood: DataTypes.STRING,
  journalEntry: DataTypes.TEXT,
  date: DataTypes.DATE
}, { sequelize, modelName: 'moodtracker' });

// Define Task model
class Task extends Model {}
Task.init({
  task: DataTypes.STRING,
  dateCreated: DataTypes.DATE,
  timelineForCompletion: DataTypes.DATE
}, { sequelize, modelName: 'task' });


// Set up relationships
User.hasMany(MoodTracker);  // A user can have many moodtracker entries
MoodTracker.belongsTo(User);  // A moodtracker entry belongs to a user

User.hasMany(Task);  // A user can have many tasks
Task.belongsTo(User);  // A task belongs to a user

// Sync models with database
sequelize.sync().then(async () => {
    const count = await User.count();
        if (count === 0) {
            await User.bulkCreate([
            { name: 'John Doe', email: 'johndoe@example.com', password: 'password012' },
            { name: 'Jane Smith', email: 'janesmith@example.com', password: 'mypassword345' },
            { name: 'Alice Johnson', email: 'alicejohnson@example.com', password: 'alicepassword678' }
            ]);
            console.log('Sample users created!');
        }

const moodCount = await MoodTracker.count();
  if (moodCount === 0) {
    // Create sample mood tracker entries
    const john = await User.findOne({ where: { name: 'John Doe' } });
    const jane = await User.findOne({ where: { name: 'Jane Smith' } });

    await MoodTracker.bulkCreate([
      { mood: 'Happy', journalEntry: 'Had a great day today!', date: new Date(), userId: john.id },
      { mood: 'Sad', journalEntry: 'Felt down today, hope tomorrow is better.', date: new Date(), userId: jane.id }
    ]);
    console.log('Sample moodtracker entries created!');
  }

  const taskCount = await Task.count();
  if (taskCount === 0) {
    // Create sample task entries
    const john = await User.findOne({ where: { name: 'John Doe' } });
    const jane = await User.findOne({ where: { name: 'Jane Smith' } });

    await Task.bulkCreate([
      { task: 'Complete project', dateCreated: new Date(), timelineForCompletion: new Date('2024-12-01'), userId: john.id },
      { task: 'Attend meeting', dateCreated: new Date(), timelineForCompletion: new Date('2024-11-15'), userId: jane.id }
    ]);
    console.log('Sample task entries created!');
  }
});

// Middleware for parsing request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CRUD routes for User model
app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
});

app.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.put('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// CRUD routes for MoodTracker model
app.get('/moodtrackers', async (req, res) => {
    const moodtrackers = await MoodTracker.findAll();
    res.json(moodtrackers);
  });
  
  app.get('/moodtrackers/:id', async (req, res) => {
    const moodtracker = await MoodTracker.findByPk(req.params.id);
    if (moodtracker) {
      res.json(moodtracker);
    } else {
      res.status(404).json({ message: 'Moodtracker entry not found' });
    }
  });
  
  app.post('/moodtrackers', authenticateToken, async (req, res) => {
    const { mood, journalEntry, date } = req.body;
    const moodtracker = await MoodTracker.create({ mood, journalEntry, date, userId: req.userId }); // Assigns moodtracker to logged-in user
    res.status(201).json(moodtracker);
  });
  
  app.put('/moodtrackers/:id', async (req, res) => {
    const moodtracker = await MoodTracker.findByPk(req.params.id);
    if (moodtracker) {
      await moodtracker.update(req.body);
      res.json(moodtracker);
    } else {
      res.status(404).json({ message: 'Moodtracker entry not found' });
    }
  });
  
  app.delete('/moodtrackers/:id', async (req, res) => {
    const moodtracker = await MoodTracker.findByPk(req.params.id);
    if (moodtracker) {
      await moodtracker.destroy();
      res.json({ message: 'Moodtracker entry deleted' });
    } else {
      res.status(404).json({ message: 'Moodtracker entry not found' });
    }
  });

  // CRUD routes for Task model
app.get('/tasks', async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
  });
  
  app.get('/tasks/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task entry not found' });
    }
  });
  
  app.post('/tasks', authenticateToken, async (req, res) => {
    const { task, dateCreated, timelineForCompletion} = req.body;
    const newTask = await Task.create({ task, dateCreated, timelineForCompletion, userId: req.userId }); // Assigns task to logged-in user
    res.status(201).json(newTask);
  });
  
  app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.update(req.body);
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task entry not found' });
    }
  });
  
  app.delete('/tasks/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.destroy();
      res.json({ message: 'Task entry deleted' });
    } else {
      res.status(404).json({ message: 'Task entry not found' });
    }
  });

// Register route
app.post('/register', async (req, res) => {
  try {
  const {name, email, password} = req.body;

  // Debugging input
  console.log('Request body:', req.body);

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields (name, email, password) are required'});
  }

  // Checks for existing user
  const existingUser = await User.findOne({ where: { email: email || ''} });
  console.log('Existing user:', existingUser);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use'});
  }

  // Create a new user
  const newUser = await User.create({name, email, password});

  // Send a success response (A token return could be used if needed here)
  res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
} catch (err) {
  console.error('Error in /register:', err);
  res.status(500).json({ message: 'Internal server error'});
}
});

// Login route
app.post('/login', async (req, res) => {
  const {email, password} = req.body;

  // Log the incoming credentials for debugging
  console.log('Login attempt with email:', email);

  // User search by email
  const user = await User.findOne({ where: {email} });
  if (!user) {
    console.log('User not found:', email);
    return res.status(400).json({ message: 'User not found'});
  }

  // Validate Password
  const isPasswordValid = await user.validatePassword(password);
  console.log('Password valid:', isPasswordValid); // Log the password validation result
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials please ReEnter'});
  }

  // Generate JWT token and send it back
  const token = generateToken(user.id);
  res.json({ message: 'Login successful', token});
});

// Protected Route: Profile (Only accessible if logged-in)
app.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.userId); // Get the user based on decoded JWT userId
  if (!user) {
    return res.status(404).json({ message: 'User not found'});
  }
  res.json({ name: user.name, email: user.email});
});


// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});