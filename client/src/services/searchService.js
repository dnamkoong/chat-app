import {
  API_KEY_YOUTUBE,
  BASE_URL_YOUTUBE,
  STATS_URL_YOUTUBE
} from '../config';

const getSearchQueryYT = async (data, pageYT) => {
  try {
    const response = await fetch(`${BASE_URL_YOUTUBE}${data.search}${ pageYT ? `&pageToken=${pageYT}` : "" }&key=${API_KEY_YOUTUBE}`);

    const json = await response.json();

    return json
  } catch(error) {
    return error;
  }
}

const getSearchPageYT = async(items) => {
  let ids = items.map(item => item.id.videoId)
  ids = ids.toString()

  try {
    const response = await fetch(`${STATS_URL_YOUTUBE}${ids}&key=${API_KEY_YOUTUBE}`);
    const json = await response.json();

    return json;
  } catch(error) {
    return error;
  }
}

export default { getSearchQueryYT, getSearchPageYT }
