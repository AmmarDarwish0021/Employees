const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const Employee = require('./models/employee');
const Project = require('./models/project');
const ProjectAssignment = require('./models/projectAssignment');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB url
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);  // Exit 
}
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log(`Error connecting to MongoDB: ${err}`);
});

// Define endpoints

// Employee
app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Project
app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Project Assignment
app.post('/api/project_assignments', async (req, res) => {
  try {
    const projectAssignment = new ProjectAssignment(req.body);
    await projectAssignment.save();
    res.status(201).send(projectAssignment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Fetch project assignments
app.get('/api/project_assignments', async (req, res) => {
  try {
    const assignments = await ProjectAssignment.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employee_id',
          foreignField: 'employee_id',
          as: 'employee_details'
        }
      },
      { $unwind: '$employee_details' },
      {
        $lookup: {
          from: 'projects',
          localField: 'project_code',
          foreignField: 'project_code',
          as: 'project_details'
        }
      },
      { $unwind: '$project_details' },
      {
        $project: {
          employee_id: 1,
          employee_name: '$employee_details.full_name',
          project_name: '$project_details.project_name',
          start_date: 1
        }
      },
      { $sort: { start_date: -1 } },
      { $limit: 5 }
    ]);

    res.send(assignments);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
