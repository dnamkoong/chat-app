export const searchState = {
  query: [],
  items: [],
  pagePrev: '',
  pageNext: '',
  videoHistory: [],
  searchHistory: [],
};

export const searchReducer = (state = searchState, action) => {
  switch (action?.type) {
    case 'GET_YOUTUBE':
      return {
        ...state,
        pagePrev: action.payloadPage.prevPageToken,
        pageNext: action.payloadPage.nextPageToken,
        items: action.payloadItems.items
      }
    case 'VIDEO_HISTORY':
      return {
        ...state,
        videoHistory: [
          ...state.videoHistory,
          action.payload
        ]
      }
    case 'SEARCH_HISTORY':
        return {
          ...state,
          searchHistory: action.payloadItems.searchHistory,
        }
    default:
      return state;
  }
}