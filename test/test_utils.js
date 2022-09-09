import {Base} from '../src/common/airtable.js';
import {getApi} from '../src/common/bill_com.js';

const billComApi = () => {
  return getApi(
      process.env.AIRTABLE_ORG_IDS_BASE_ID,
      process.env.AIRTABLE_API_KEY,
      process.env.BILL_COM_USER_NAME,
      process.env.BILL_COM_PASSWORD,
      process.env.BILL_COM_DEV_KEY,
      true);
};

const airtableBase = () => {
  return new Base(process.env.AIRTABLE_BASE_ID, process.env.AIRTABLE_API_KEY);
};
