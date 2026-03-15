const Task = require("../models/Task");
const { encryptField, decryptField } = require("../utils/encryption");

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;
    const startIndex = (page - 1) * limit;

    // ADD THIS DEBUG LOG
    console.log("Search term received:", search);
    console.log("Status filter:", status);
    console.log("User ID:", req.user.id);

    // Build base query
    let query = { user: req.user.id };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Search in BOTH title and description
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
      console.log("Search query:", JSON.stringify(query.$or, null, 2));
    }

    // Execute query with pagination
    const tasks = await Task.find(query)
      .sort("-createdAt")
      .limit(limit)
      .skip(startIndex);

    console.log(`Found ${tasks.length} tasks matching search`);

    // Get total count
    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Encrypt sensitive fields
    req.body.title = encryptField(req.body.title);
    req.body.description = encryptField(req.body.description);

    const task = await Task.create(req.body);

    // Decrypt for response
    const taskObj = task.toObject();
    taskObj.title = decryptField(taskObj.title);
    taskObj.description = decryptField(taskObj.description);

    res.status(201).json({
      success: true,
      data: taskObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    // Encrypt fields if they exist in request
    if (req.body.title) {
      req.body.title = encryptField(req.body.title);
    }
    if (req.body.description) {
      req.body.description = encryptField(req.body.description);
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Decrypt for response
    const taskObj = task.toObject();
    taskObj.title = decryptField(taskObj.title);
    taskObj.description = decryptField(taskObj.description);

    res.status(200).json({
      success: true,
      data: taskObj,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Make sure user owns task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
