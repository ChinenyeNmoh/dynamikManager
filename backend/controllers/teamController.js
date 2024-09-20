import Team from '../models/teamModel.js';


// CREATE a new team
const createTeam = async (req, res) => {
  try {
    const { name, projects, members } = req.body;
    // Validate input
    if (!name) {
      return res.status(400).json({ message: 'Please provide a name' });
    }

    // Check if the team already exists
    const teamExists = await Team.findOne({ name });
    if (teamExists) {
      return res.status(400).json({ message: 'Team already exists' });
    }
 
    // Create a new team with projects and members
    const newTeam = new Team({
      name,
      projects: projects || [], 
      members: members || []    
    });

    // Save the team
    const savedTeam = await newTeam.save();

    res.status(201).json({ message: 'Team created successfully', team: savedTeam });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};


// READ all teams
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find({}).populate('members', 'name email').populate('projects', 'name');
    if (!teams || teams.length === 0) {
        return res.status(404).json({ message: 'No teams found' });
    }
    res.status(200).json({message: 'All teams', teams});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// READ a single team by ID
const getTeam =  async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'name email').populate('projects', 'name');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.status(200).json({team});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a team by ID
const updateTeam =  async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTeam) return res.status(404).json({ message: 'Team not found' });
    res.status(200).json(updatedTeam);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// DELETE a team by ID
const deleteTeam =  async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) return res.status(404).json({ message: 'Team not found' });
    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createTeam, getAllTeams, getTeam, updateTeam, deleteTeam };
