import { createContext, useReducer } from "react";

export const SearchContext = createContext(null);
export const SearchDispatchContext = createContext(null);

export function SearchProvider({ children }) {
  const [state, dispatch] = useReducer(searchReducer, searchState);

  return (
    <SearchContext.Provider value={state}>
      <SearchDispatchContext.Provider value={dispatch}>
        {children}
      </SearchDispatchContext.Provider>
    </SearchContext.Provider>
  )
};

function searchReducer(state = searchState, action) {
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
        searchHistory: [
          ...state.searchHistory,
          action.payload
        ],
      }
    default:
      return state;
  }
};

const searchState = {
  query: [],
  items: [],
  pagePrev: '',
  pageNext: '',
  videoHistory: [],
  searchHistory: [],
};