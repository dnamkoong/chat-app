export const nowPlayingState = {
  volume: 100
};

export const nowPlayingReducer = (state = nowPlayingState, action) => {
  switch(action.type) {
    case 'VOLUME_ADJUST':
      return {
        ...state,
        volume: action.data
      }
    default:
      return state
  }
}