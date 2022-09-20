import { RateLimiterFixed } from '@kustomer/hackathon-kustomer-sdk/dist/src/http/rateLimiterFixed';
import jwtDecode from 'jwt-decode';
import yargs from 'yargs';
import ms from 'ms';
import {
    exportCustomers, exportMessages, exportNotes, exportConversations, exportKObjects, exportUsers, exportCompanies, ExportOptions,
} from './exports';
import Kustomer from './kustomer';

type ApiKey = {
    instance: string,
    token: string
};

function checkApiKeys(apiKey: ApiKey) {
    if (typeof apiKey === 'object'
        && 'instance' in apiKey
        && 'token' in apiKey
    ) {

        const decode = jwtDecode(apiKey.token) as any;
        if (decode.orgName !== apiKey.instance) throw new Error('The Auth Token mismatches the Instance name');
    } else {
        throw new Error('Incomplete API Key in "ApiKey.json" file');
    }
}

type Exporter = (options: ExportOptions) => void;

const exporters: Record<string, Exporter> = {
    'note': exportNotes,
    'message': exportMessages,
    'conversation': exportConversations,
    'customer': exportCustomers,
    'kobject': exportKObjects,
    'user': exportUsers,
    'company': exportCompanies,
};

(async function() {
    console.log('Offboarding Data Export Utility');
    try {
        const ApiKey = require('../ApiKey.json');
        checkApiKeys(ApiKey);
    
        const argv = await yargs(process.argv).options({
            object: { type: 'string', default: '' },
            startDate: { type: 'string', default: '' },
            endDate: { type: 'string', default: '' },
            interval: { type: 'string', default: undefined },
            klass: { type: 'string', default: undefined },
            rpm: { type: 'number', default: 120 },
        }).argv;

        console.log('Max request per minute:', argv.rpm);
        if (isNaN(argv.rpm)) throw new Error('Parameter rps (request per second) must be valid numeric value');
    
        Kustomer.init({
            instance: ApiKey.instance,
            apiKey: ApiKey.token,
            rateLimiter: new RateLimiterFixed({
                intervalMs: 1000,
                maxRequests: Math.trunc(argv.rpm / 60)
            }),
            debug: false
        });
    
        const exp = exporters[argv.object as string];
        if (!exp) throw new Error(`Export "${argv.object}" is not known, options are: ${Object.keys(exporters).join(', ')}`);
    
        const options = {
            startDate: argv.startDate ? new Date(argv.startDate) : undefined,
            endDate: argv.endDate ? new Date(argv.endDate) : undefined,
            interval: argv.interval ? ms(argv.interval) as unknown as number : undefined,
            klass: argv.klass
        };
    
        await exp(options);
    } catch (e) {
        console.log(e);
    }
})();
