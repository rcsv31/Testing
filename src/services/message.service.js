import MessageModel from "../models/message.model.js";

const getAllMessages = async () => {
  return await MessageModel.find().lean();
};

export default {
  getAllMessages,
};
