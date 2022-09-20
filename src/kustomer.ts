import KustomerAPI from '@kustomer/hackathon-kustomer-sdk';
import { Message } from '@kustomer/hackathon-kustomer-sdk/dist/src/models/message';
import { Conversation } from '@kustomer/hackathon-kustomer-sdk/dist/src/models/conversation';

export let SDK: KustomerAPI;

function init(options: any) {
    SDK = new KustomerAPI(options);
}

async function fetchAllSearchPages<T>(searchBy: Function, startDate: Date, endDate: Date) {
    let results: T[] = [];    
    let page = 1;
    let resp;

    do {
        resp = await searchBy({
            and: [
                { createdAt: { gte: startDate.toISOString() }},
                { createdAt: { lt: endDate.toISOString() }},
            ]
        }, {
            page,
            pageSize: 500,
        });

        if (resp.errors) {
            console.log(resp.errors);
            const err = resp.errors.length > 0 ? resp.errors[0] : undefined;
            throw new Error(`Error ${err?.code}`)
        }

        if (resp?.meta?.totalPages > 20) {
            throw new Error('Max numbers of pages exceeded');
        }

        results = [...results, ...resp.data];
        page++;
    } while (resp?.meta?.totalPages && resp?.meta?.totalPages > page);

    return results;
}

async function getConversationsByRange(startDate: Date, endDate: Date) {
    let results: Conversation[] = [];    
    let page = 1;
    let resp;

    do {
        resp = await SDK.conversations().search({
            and: [
                { createdAt: { gte: startDate.toISOString() }},
                { createdAt: { lt: endDate.toISOString() }},
            ]
        }, {
            page,
            pageSize: 500,
        });

        if (resp.errors) {
            console.log(resp.errors);
            const err = resp.errors.length > 0 ? resp.errors[0] : undefined;
            throw new Error(`Error ${err?.code}`)
        }

        results = [...results, ...resp.data];

        if (page === 1) console.log('Conversation - Total pages:', resp?.meta?.totalPages);        
        page++;
    } while (resp?.meta?.totalPages && resp?.meta?.totalPages > page);

    return results;
}

async function getMessagesByRange(startDate: Date, endDate: Date) {
    let results: Message[] = [];    
    let page = 1;
    let resp;

    do {
        resp = await SDK.messages().search({
            and: [
                { createdAt: { gte: startDate.toISOString() }},
                { createdAt: { lt: endDate.toISOString() }},
            ]
        }, {
            page,
            pageSize: 500,
        });

        if (resp.errors) {
            console.log(resp.errors);
            const err = resp.errors.length > 0 ? resp.errors[0] : undefined;
            throw new Error(`Error ${err?.code}`)
        }

        results = [...results, ...resp.data];

        if (page === 1) console.log('Messages - Total pages:', resp?.meta?.totalPages);        
        page++;
    } while (resp?.meta?.totalPages && resp?.meta?.totalPages > page);

    return results;
}

export default {
    init,
    fetchAllSearchPages,
    getConversationsByRange,
    getMessagesByRange,
}

