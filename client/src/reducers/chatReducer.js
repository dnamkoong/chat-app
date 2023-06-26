export const chatState = {
 userList: []
};

export const chatReducer = (state = chatState, action) => {
  switch (action?.type) {
    case 'POST_USER_LIST':
      return {
        userList: action.payload
      }
    default:
      return state;
  }
}