const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, Model, DataTypes } = require('sequelize');

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
            { name: 'John Doe', email: 'johndoe@example.com', password: 'password123' },
            { name: 'Jane Smith', email: 'janesmith@example.com', password: 'mypassword456' },
            { name: 'Alice Johnson', email: 'alice.johnson@example.com', password: 'alicepassword789' }
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
  
  app.post('/moodtrackers', async (req, res) => {
    const { mood, journalEntry, date, userId } = req.body;
    const moodtracker = await MoodTracker.create({ mood, journalEntry, date, userId });
    res.json(moodtracker);
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
  
  app.post('/tasks', async (req, res) => {
    const { task, dateCreated, timelineForCompletion, userId } = req.body;
    const newTask = await Task.create({ task, dateCreated, timelineForCompletion, userId });
    res.json(newTask);
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
  

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});