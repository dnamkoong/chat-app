export const chatState = {
 userList: [],
 chatHistory: [],
};

export const chatReducer = (state = chatState, action) => {
  switch (action?.type) {
    case 'POST_USER_LIST':
      return {
        userList: action.payload
      }
    case 'CHAT_HISTORY':
      return {
        ...state,
        chatHistory: action.payload
      }
    default:
      return state;
  }
}