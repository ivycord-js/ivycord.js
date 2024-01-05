const BASE_URL = "https://discord.com/api/v10";

export async function request(endpoint: string, options?: RequestInit) {
  const url = `${BASE_URL}${endpoint}`;

  return fetch(url, options).then(response => {
    if(response.ok) {
      return response.json()
    } else {
      // nmp sta ovdje
    }
  }).catch(err => {
    // nmp sta ovdje
  })
}