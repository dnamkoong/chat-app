export const searchState = {
  query: [],
  items: [],
  pagePrev: '',
  pageNext: '',
};

export const searchReducer = (state = searchState, action) => {
  switch (action.type) {
    case 'GET_YOUTUBE':
      console.log('reducer GET_YOUTUBE: ', action);
      return {
        ...state,
        pagePrev: action.payloadPage.prevPageToken,
        pageNext: action.payloadPage.nextPageToken,
        items: action.payloadItems.data.items,
      }
    default:
      return state;
  }
}