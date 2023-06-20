export const initialState = {
 userList: []
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'POST_USER_LIST':
      console.log('POST_USER_LIST: ', action.payload);
      return {
        ...state,
        userList: state.userList.concat(action.payload)
      }
    case 'POST_USER_LIST_LEAVE':
      console.log('POST_USER_LIST_LEAVE: ', action.payload);
      return {
        ...state,
        userList: state.userList.filter(el => el.id !== action.payload.id)
      }
    default:
      return state;
  }
}

export default chatReducer;