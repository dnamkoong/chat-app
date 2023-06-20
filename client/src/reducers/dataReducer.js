import { chatReducer, chatState } from "./chatReducer";
import { searchReducer, searchState } from "./searchReducer";
import { nowPlayingReducer, nowPlayingState } from "./nowPlayingReducer";

export const combineReducers = (reducers) => {
  return function (state, action) {
    const nextState = {};

    for (let key in reducers) {
      nextState[key] = reducers[key](state[key], action);
    }
    return nextState;
  }
}
