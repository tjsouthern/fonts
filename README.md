# Offboarding Data Export Utility
This a data export utility allows you to export JSON data as part of the offboarding client process.

## Features
- Supported objects: Companies, Users, Customers, Conversation, Messages, KObjects and Notes.
- Large data export (beyond than 10K records) by doing multiples request by time interval.
- Parametrized request throttling allows you to indicate the max RPM. By default 120 is used.

## Install Node Packages
```bash
yarn install
```

> Note: This project depends on Kustomer SDK's for API. Since at this moment `@kustomer/hackathon-kustomer-sdk` is private package, please read the Kustomer SDK's documentation and tutorial [here](https://github.com/kustomer/hackathon-kustomer-sdk) for details on how to use it from a private NPM repository.

## API Key
Create `ApiKey.json` file in the project's root folder with your own account information.

```json
{
    "instance": "your-instance-name",
    "token": "eyJhbGciOiJIUzI1...m8ZN2GNp4"
}
```

## How to run an export
You could use the `yarn` utility to run the script included to compile and run an export as follows:
```bash
yarn export --object=company
```
> The export data files will be placed in the `out` folder in one o more files. The folder `out` must already exist.


## Common export parameters
- `--object=<object-type>`    Indicate the type of object to be exported
- `--startDate=<date-iso>`    The starting date for data export to be exported. This will be used as filter as `createdAt >= <startDate>`
- `--endDate=<date-iso>`    The ending date (non-inclusive) for data export to be exported. This will be used as filter as `createdAt < <endDate>`
- `--interval=<str-expr>`   The time interval to be used to split the data request in multiples requests to avoid reaching the 10K limit. This can be expecified as an string expression of the time interval such as: 30m, 1h, 1d, 7d, 30d.
- `--klass=<klass-name>`    The Klass name of the KObject to export. This apply only to KObject objects.
- `--rpm=<max-n-request>`    Indicates the maximun number of requests to perform per minute.

## Companies
```bash
# export all company objects, parameters startDate/endDate are not supported
yarn export --object=company
```

## Users
```bash
# export all user objects, parameters startDate/endDate are not supported 
yarn export --object=user
```

## Customers
```bash
# export customer objects created from Jan 1st 2021 to March 31th of 2022 by 30 days interval.
# note: parameters startDate/endDate and interval are mandatory
yarn export --object=customer --startDate=2021-01-01T00:00:00.000Z --endDate=2022-04-01T00:00:00.000Z --interval=30d
```

## Conversations
```bash
# export conversation objects created from Jan 1st 2021 to March 31th of 2022 by 7d days interval using 240 RPMs
# note: parameters startDate/endDate and interval are mandatory
yarn export --object=conversation --startDate=2021-01-01T00:00:00.000Z --endDate=2022-04-01T00:00:00.000Z --interval=7d --rpm=240
```

## Messages
```bash
# export customer objects created from Jan 1st 2021 to March 31th of 2022 by 12 hours interval.
# note: parameters startDate/endDate and interval are mandatory
yarn export --object=message --startDate=2021-01-01T00:00:00.000Z --endDate=2022-04-01T00:00:00.000Z --interval=12h
```

## Notes
```bash
# export customer objects created from Jan 1st 2021 to March 31th of 2022 by 30 days interval.
# note: parameters startDate/endDate and interval are mandatory
yarn export --object=note --startDate=2021-01-01T00:00:00.000Z --endDate=2022-04-01T00:00:00.000Z --interval=30d
```

## KObjects
```bash
# export all kobject objects for the specified klass (mandatory)
# parameters startDate/endDate are not supported and the limit is 10K records
yarn export --object=kobject --klass=order
```
