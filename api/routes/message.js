const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { protectedRoute } = require("../utils/protectedRoute");
const { getRecipientSocketId, io } = require("../socket/socket");

// Send Messages ((Very very Important 🙄)) ((Focus 🧠))
router.post("/send", protectedRoute, async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });
    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: { text: message, sender: senderId },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    // Socket.io
    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Messages From (((OtherUser)))
router.get("/get/:otherUserId", protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId } = req.params;

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });
    !conversation && res.status(404).json("Conversation not found 😥");

    // ((-1)) new then old
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Conversations
router.get("/get/all/conversations", protectedRoute, async (req, res) => {
  const userId = req.user._id;
  try {
    // ((Focus 🧠)) populate get one thing i wanted it
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "username profilePic",
    });

    // remove the currentUser from the participants array
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
