import { BRAND_IDS } from '@tamanu/constants';

const CAMBODIA_CONFIG = {
  id: BRAND_IDS.CAMBODIA,
  name: 'KhmEIR',
};

const TAMANU_CONFIG = {
  id: BRAND_IDS.TAMANU,
  name: 'Tamanu',
};

export const checkIsURLCambodia = (currentURL = window.location.hostname) => {
  const whitelist = ['khmer', 'cambodia', 'khmeir'];
  const regex = new RegExp(whitelist.join('|'), 'i');
  return regex.test(currentURL);
};

// We would ideally like to use .env variables to switch between brands, but this is not possible at the moment with
// our build setup. There is a ticket to update the build system (NOT-298) which will allow us to use .env variables
// Note that normal config or settings is not suitable since the brand config also needs to be accessed from .html files
const getBrandConfig = () => (checkIsURLCambodia() ? CAMBODIA_CONFIG : TAMANU_CONFIG);

export const getBrandName = () => getBrandConfig().name;

export const getBrandId = () => getBrandConfig().id;
