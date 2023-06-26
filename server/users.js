let users = [];

const addUser = (id, name, room, color) => {
  const user = { id, name, room, color };

  users.push(user)

  return user;
}

const getUser = (id) => {
  return users.find(user => user.id === id);
}

const removeUser = (id) => {
  let toRemove = users.filter(user => user.id === id);
  users = users.filter(user => user.id !== id);

  return toRemove[0];
}

const getUsersInRoom = (room) => {
  return users.filter(user => user.room === room)
}

module.exports = {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom
}