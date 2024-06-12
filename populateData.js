const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/employee');
const Project = require('./models/project');
const ProjectAssignment = require('./models/projectAssignment');

dotenv.config();

const mongoURI = process.env.MONGODB_URI;
mongoose.set('strictQuery', true);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    populateData().then(() => {
      console.log('Data populated successfully');
      mongoose.connection.close();
    }).catch(error => {
      console.error('Error populating data', error);
      mongoose.connection.close();
    });
  })
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);  // Exit 
  });

const populateData = async () => {
  try {
    await Employee.deleteMany({});
    await Project.deleteMany({});
    await ProjectAssignment.deleteMany({});

    const employees = [
      { employee_id: 'E1', full_name: 'Ammar', email: 'Ammar@example.com' },
      { employee_id: 'E2', full_name: 'Ahmad', email: 'Ahmad@example.com' },
      { employee_id: 'E3', full_name: 'Dani', email: 'Dani@example.com' },
      { employee_id: 'E4', full_name: 'Deema', email: 'Deema@example.com' },
      { employee_id: 'E5', full_name: 'Salma', email: 'Salma@example.com' }
    ];

    const projects = [
      { project_code: 'P1', project_name: 'Project One', project_description: 'First Project' },
      { project_code: 'P2', project_name: 'Project Second', project_description: 'Second Project' },
      { project_code: 'P3', project_name: 'Project Third', project_description: 'Third Project' },
      { project_code: 'P4', project_name: 'Project Fourth', project_description: 'Fourth Project' },
      { project_code: 'P5', project_name: 'Project Fifth', project_description: 'Fifth Project' }
    ];

    const projectAssignments = [
      { employee_id: 'E1', project_code: 'P1', start_date: new Date('2024-01-01') },
      { employee_id: 'E2', project_code: 'P2', start_date: new Date('2024-02-01') },
      { employee_id: 'E3', project_code: 'P3', start_date: new Date('2024-03-01') },
      { employee_id: 'E4', project_code: 'P4', start_date: new Date('2024-04-01') },
      { employee_id: 'E5', project_code: 'P5', start_date: new Date('2024-05-01') }
    ];

    await Employee.insertMany(employees);
    await Project.insertMany(projects);
    await ProjectAssignment.insertMany(projectAssignments);

  } catch (error) {
    throw new Error(`Error populating data: ${error.message}`);
  }
};
