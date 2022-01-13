# vulcan-ui
The current ui of vulcan.
It's implemented using jquery and parceljs as bundler and transpiler.
Apart from jquery it also has support for Vue.js and typescript.

 ## Prerequisites

   - [node](https://nodejs.org/en/)
   - [parcel](https://parceljs.org/getting_started.html)

## Running locally without using docker

To run the ui locally execute following command at root of the repo:

```
npm install

npm run-script serve

open http://localhost:1234/assets/edit-assets.html?team_id=e720a229-b502-494c-bacb-7b0a17c72e66

```

**[Important]** Clear all site data (remove all cookies)

The first time you visit the application you will be asked to enter your token
for the dev environment of the vulcan-api.

While the serve command is executing it will regenerate the ui every time you modify any file.

## The code

 All the code lives in the src/ directory.

## Updating the TypeScript vulcan-api library

The vulcan-api library used by the Vue.js and TypeScript pages is generated from
the vulcan-api swagger file. The update it execute:
``` docker run --rm -it -v ${PWD}:/local -v ${PWD}/../vulcan-api/docs:/src openapitools/openapi-generator-cli generate -i /src/swagger.json -g typescript-fetch -o /local/src/services/vulcan-api  ```

Note:
The command supposes the swagger file is in ```../vulcan-api/docs``` and is executed at the root of the vulcan-ui repository.


# Run using Docker

 Those are the variables you have to use:

|Variable|Description|Sample|
|---|---|---|
|VULCAN_API||http://localhost:8081/api|
|PORT|Port to listen|Defaults to 8080|
|UI_DOCS_API_LINK|Link to Vulcan API user docs|Defaults to UI root page|
|UI_DOCS_WHITELISTING_LINK|Link to Vulcan scanner IPs|Defaults to UI root page|
|UI_DOCS_DISCOVERY_LINK|Link to asset discovery documentation|Defaults to UI root page|
|UI_DOCS_AUDITROLE_LINK|Link to doc regarding audit role to scan AWS accounts|Defaults to UI root page|
|UI_CONTACT_EMAIL|Vulcan administrators contact email||
|UI_CONTACT_SLACK|Vulcan administrators contact slack channel||
|TEAMS_CRUD|Feature flag to activate the teams crud|default to true|

```bash
docker build . -t vui

# Use the default config.toml customized with env variables.
docker run --env-file ./local.env vui

# Or set the variable
docker run --env API_URL="http://localhost:8081/api" -p 8080:8080 vui
```
