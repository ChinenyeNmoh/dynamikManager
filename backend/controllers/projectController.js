import Project from '../models/projectModel.js';


// CREATE a new project
const createProject =  async (req, res) => {
  try {
    if (!req.body.name ) {
      return res.status(400).json({ message: 'Please provide name' });
    }
    const projectExists = await Project.findOne({ name : req.body.name });
    if (projectExists) {
      return res.status(400).json({ message: 'Project already exists' });
    }
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();
    res.status(201).json({message: 'Project created successfully', project: savedProject});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// READ all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate({
      path: 'team',
      populate: {
        path: 'members',
      }
    }).sort({ createdAt: -1 });
    
    if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'No projects found' });
    }
    res.status(200).json({message: 'All projects', projects});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// READ a single project by ID
const getProject =  async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate({
      path: 'team',
      populate: {
        path: 'members',
      }
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({project});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a project by ID
const updateProject =  async (req, res) => {
  try {
    console.log(req.body);
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({project:updatedProject});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// DELETE a project by ID
const deleteProject =  async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createProject, getAllProjects, getProject, updateProject, deleteProject };
