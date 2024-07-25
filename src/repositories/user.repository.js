import User from "../models/user.model.js";

class UserRepository {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async getUserById(userId) {
    return await User.findById(userId);
  }

  async getUserByUsername(username) {
    return await User.findOne({ username });
  }
}

export default new UserRepository();
