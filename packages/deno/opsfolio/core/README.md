## Running

Run `deno run models.ts` to execute the unit tests

## To generate file

Run `deno-run models.ts sql --dest file-name.sql` to generate sql file

## To create db file

Run `deno-run models.ts | sqlite3 test.db` to generate sql file

## To remove existing db file and create new one

Run `rm test.db && deno-run models.ts | sqlite3 testdb.db`

## To create a puml

Run `deno-run models.ts diagram --dest test.puml`
