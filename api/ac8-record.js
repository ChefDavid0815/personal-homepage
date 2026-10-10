import {get,put} from '@vercel/blob';
import {createAc8RecordHandler} from '../lib/ac8-record-handler.js';
import {createAc8BlobStore} from '../lib/ac8-record-store.js';
const store=createAc8BlobStore({getBlob:get,putBlob:put});
export default createAc8RecordHandler({store,secret:()=>process.env.AC8_SYNC_SECRET});
