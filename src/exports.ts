import { open } from 'fs/promises';
import _ from 'lodash';
import { getDateRangesMillis } from './dateutils';
import { Conversation } from '@kustomer/hackathon-kustomer-sdk/dist/src/models/conversation';
import Kustomer, { SDK } from './kustomer';
import { Note } from '@kustomer/hackathon-kustomer-sdk/dist/src/models/note';
import { Customer } from '@kustomer/hackathon-kustomer-sdk/dist/src/models/customer';
import { Message } from '@kustomer/hackathon-kustomer-sdk/dist/src/models/message';

const messages = {
    startDateIsMandatory: 'startDate parameter is mandatory (ISO format), ex: 2022-01-01T00:00:00.000Z',
    endDateIsMandatory: 'endDate parameter is mandatory, ex: 2022-01-01T00:00:00.000Z',
    intervalIsMandatory: 'interval parameter is mandatory, ex: 30m, 1h, 1d, 7d, 30d',
}

export interface ExportOptions {
    startDate?: Date,
    endDate?: Date,
    interval?: number,
    klass?: string,
}

function getYYMMDD(d: Date) {
    return d.toISOString().split('T')[0];
}

export async function exportCompanies(options: ExportOptions) {
    let resp;
    let page = 1;

    do {
        resp = await SDK.companies().getAll({ page, pageSize: 1000 });

        const out = await open(`./out/companies-${page}.json`, 'w');
        out.write(JSON.stringify(resp.data));
        out.close();

        page++;
    } while (resp?.meta?.totalPages && resp?.meta?.totalPages > page);
}

export async function exportUsers(options: ExportOptions) {
    let resp;
    let page = 1;

    do {
        resp = await SDK.users().getAll({ page, pageSize: 1000 });

        const out = await open(`./out/users-${page}.json`, 'w');
        out.write(JSON.stringify(resp.data));
        out.close();

        page++;
    } while (resp?.links.next);
}


// Note: This limits 100K records
export async function exportKObjects(options: ExportOptions) {
    const { klass } = options;
    let resp;
    let page = 1;

    if (!klass || klass.length == 0) throw new Error('Parameter klass is mandatory.');

    do {
        resp = await SDK.kobjects().getAll(klass, { page, pageSize: 1000 });

        const out = await open(`./out/kobject-${klass}-${page}.json`, 'w');
        out.write(JSON.stringify(resp.data));
        out.close();

        page++;
    } while (resp?.links.next);
}

export async function exportCustomers(options: ExportOptions) {
    const { startDate, endDate, interval } = options;

    if (!startDate) throw new Error(messages.startDateIsMandatory);
    if (!endDate) throw new Error(messages.endDateIsMandatory);
    if (!interval) throw new Error(messages.intervalIsMandatory);

    const dateRanges = getDateRangesMillis(startDate, endDate, interval);
    console.log(`Date ranges: ${dateRanges.length}`);

    let data: Customer[] = [];
    let previousDt, dt;
    for (let range of dateRanges) {

        dt = getYYMMDD(range.startDate);

        console.log(`\tDate range: ${range.startDate.toISOString()} - ${range.endDate.toISOString()}`);

        const customers = await Kustomer.fetchAllSearchPages<Customer>(
            SDK.customers().search.bind(SDK.customers()), range.startDate, range.endDate,
        );

        if (previousDt === dt) {
            data = [...data, ...customers];

        } else {
            if (data.length > 0) {
                const out = await open(`./out/customers-${previousDt}.json`, 'w');
                out.write(JSON.stringify(data));            
                out.close();
            }

            data = customers;
        }

        previousDt = dt;
    }

    if (data.length > 0) {
        const out = await open(`./out/customers-${dt}.json`, 'w');
        out.write(JSON.stringify(data));            
        out.close();
    }
}

export async function exportConversations(options: ExportOptions) {
    const { startDate, endDate, interval } = options;

    if (!startDate) throw new Error(messages.startDateIsMandatory);
    if (!endDate) throw new Error(messages.endDateIsMandatory);
    if (!interval) throw new Error(messages.intervalIsMandatory);

    const dateRanges = getDateRangesMillis(startDate, endDate, interval);
    console.log(`Date ranges: ${dateRanges.length}`);

    let data: Conversation[] = [];
    let previousDt, dt;
    for (let range of dateRanges) {

        dt = getYYMMDD(range.startDate);

        console.log(`\tDate range: ${range.startDate.toISOString()} - ${range.endDate.toISOString()}`);

        const conversations = await Kustomer.fetchAllSearchPages<Conversation>(
            SDK.conversations().search.bind(SDK.conversations()), range.startDate, range.endDate,
        );

        if (previousDt === dt) {
            data = [...data, ...conversations];

        } else {
            if (data.length > 0) {
                const out = await open(`./out/conversations-${previousDt}.json`, 'w');
                out.write(JSON.stringify(data));            
                out.close();
            }

            data = conversations;
        }

        previousDt = dt;
    }

    if (data.length > 0) {
        const out = await open(`./out/conversations-${previousDt}.json`, 'w');
        out.write(JSON.stringify(data));            
        out.close();
    }
}

export async function exportMessages(options: ExportOptions) {
    const { startDate, endDate, interval } = options;

    if (!startDate) throw new Error(messages.startDateIsMandatory);
    if (!endDate) throw new Error(messages.endDateIsMandatory);
    if (!interval) throw new Error(messages.intervalIsMandatory);

    const dateRanges = getDateRangesMillis(startDate, endDate, interval);
    console.log(`Date ranges: ${dateRanges.length}`);

    let data: Message[] = [];
    let previousDt, dt;
    for (let range of dateRanges) {

        dt = getYYMMDD(range.startDate);

        console.log(`\tDate range: ${range.startDate.toISOString()} - ${range.endDate.toISOString()}`);

        const messages = await Kustomer.fetchAllSearchPages<Message>(
            SDK.messages().search.bind(SDK.messages()), range.startDate, range.endDate,
        );

        if (previousDt === dt) {
            data = [...data, ...messages];

        } else {
            if (data.length > 0) {
                const out = await open(`./out/messages-${previousDt}.json`, 'w');
                out.write(JSON.stringify(data));            
                out.close();
            }

            data = messages;
        }

        previousDt = dt;
    }

    if (data.length > 0) {
        const out = await open(`./out/messages-${previousDt}.json`, 'w');
        out.write(JSON.stringify(data));            
        out.close();
    }
}

export async function exportNotes(options: ExportOptions) {
    const { startDate, endDate, interval } = options;

    if (!startDate) throw new Error(messages.startDateIsMandatory);
    if (!endDate) throw new Error(messages.endDateIsMandatory);
    if (!interval) throw new Error(messages.intervalIsMandatory);

    const dateRanges = getDateRangesMillis(startDate, endDate, interval);
    console.log(`Date ranges: ${dateRanges.length}`);

    let data: Note[] = [];
    let previousDt, dt;
    for (let range of dateRanges) {

        dt = getYYMMDD(range.startDate);

        console.log(`\tDate range: ${range.startDate.toISOString()} - ${range.endDate.toISOString()}`);

        const notes = await Kustomer.fetchAllSearchPages<Note>(
            SDK.notes().search.bind(SDK.notes()), range.startDate, range.endDate,
        );

        if (previousDt === dt) {
            data = [...data, ...notes];

        } else {
            if (data.length > 0) {
                const out = await open(`./out/notes-${dt}.json`, 'w');
                out.write(JSON.stringify(data));            
                out.close();
            }

            data = notes;
        }

        previousDt = dt;
    }

    if (data.length > 0) {
        const out = await open(`./out/notes-${dt}.json`, 'w');
        out.write(JSON.stringify(data));            
        out.close();
    } 
}
