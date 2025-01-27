const ChefSuggestion = require("../modal/menuTimeModal");
exports.addMenu = async (req, res) => {
  try {
    const { name } = req.body;

    const newChefSuggestion = new ChefSuggestion({
      name,
    });

    const savedSuggestion = await newChefSuggestion.save();
    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: savedSuggestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding Category ",
      error: error.message,
    });
  }
};

exports.getMenu = async (req, res) => {
  try {
    const suggestions = await ChefSuggestion.find();
    console.log(suggestions)
    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Category",
      error: error.message,
    });
  }
};

exports.getMenuByDate = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedSuggestion = await ChefSuggestion.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedSuggestion) {
      return res
        .status(404)
        .json({ success: false, message: "Category  not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated",
      data: updatedSuggestion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Category ",
      error: error.message,
    });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSuggestion = await ChefSuggestion.findByIdAndDelete(id);

    if (!deletedSuggestion) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting Category",
      error: error.message,
    });
  }
};
