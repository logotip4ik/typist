import axios from 'axios';

export const lands = {
  QUOTABLE: 'quotable',
};

export const landAPIs = {
  [lands.QUOTABLE]: 'http://api.quotable.io/random?minLength=50&maxLength=200',
};

export const landsWhitelist = [...Object.values(lands)];

/**
 * @typedef {object} LandAdapter
 * @property {string} url api url
 * @property {() => Promise<{id?:string, text:string, author:string}>}  fetchRandom fetches for random string from an api
 */

export const landAdapters = {
  /** @returns {LandAdapter} */
  [lands.QUOTABLE]: (url) => ({
    url,
    fetchRandom: async function () {
      const { data } = await axios.get(this.url);

      return { id: data._id, text: data.content, author: data.author };
    },
  }),
};
