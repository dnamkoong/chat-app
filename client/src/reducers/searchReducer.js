export const searchState = {
  query: [],
  items: [],
  pagePrev: '',
  pageNext: '',
  searchHistory: [],
  videoHistory: [],
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
    case 'SEARCH_HISTORY':
        return {
          ...state,
          searchHistory: action.payloadItems.searchHistory,
        }
    case 'VIDEO_PLAYED_HISTORY':
      return {
        ...state,
        videoHistory: action.payloadItems.videoHistory,
      }
    default:
      return state;
  }
}