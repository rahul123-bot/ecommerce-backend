const runAgent = require("../ai/agent.js");

const aiChat = async (req, res) => {
  try {

    const { message } = req.body;

    const userId = req.user._id;

    const role = req.user.role;

    const result = await runAgent(
      message,
      userId,
      role
    );

    res.json({
      success: true,
      result,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = aiChat;