import axios from 'axios';

const BASE_URL = 'https://discord.com/api/v10';

const restRequest = (endpoint: string) => {
  const url = `${BASE_URL}/${endpoint}`;

  return axios.get(url);
};

export { restRequest };
