import { useQuery } from 'h3';

import {
  lands,
  landsWhitelist,
  landAPIs,
  landAdapters,
} from '~~/lib/constants';

import { getLand } from '~~/lib/lands';

export default async (req) => {
  const query = useQuery(req);

  const land = getLand(query.land, landsWhitelist, lands.QUOTABLE);

  const adapter = landAdapters[land](landAPIs[land]);

  return await adapter.fetchRandom();
};
