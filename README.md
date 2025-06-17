# hackathon-2025-team13


## General SetUp, Deployment and runtime

1. Create an API Key in the Solace Cloud Org you want to use for the demo -> Ensure the key has Full Event Portal access.

2. Deploy a Hub Broker in the environment you`re going to use for the demo. (This step will be automated in the future).

3. Create a new Modeled Event Mesh in the environment you want to use. 

3. Assign the Hub Broker to the used Modeled Event Mesh. 
   -> If you want to demo config push to the onPrem (Store) Broker, create an addition onPrem Broker manually with the following credentials: 

```
    Hostname http://host.docker.internal:8080
    Message VPN default
    SEMP Username admin
    SEMP URL http://host.docker.internal:8080
    Transport SMF Port 55557
    URL tcp://host.docker.internal:55557

```
    -> Export the config for the Event Management Agent (YML) to ./event-generator-parent/acme_retail_event_management_agent.yml

4. Create an Application Domain which includes the Event API and Event API Product which is deployed to your used environment. This is used by the demo publisher to create events based on the schema definition you created. 

-> You can use any App Domain of your choice. Just ensure that the Schema you use contains ENUMs so that the demo publisher represents these in the generated Events. A good example is https://solace-sso.solace.cloud/ep/designer/domains/je0tj5trsp8/schemas/1672t590r9j?domainName=Acme+Retail+-+Master+Data+Management&selectedId=1672t590r9j&selectedVersionId=08wt9emjgbh 

Ensure that the dynamic topic properties are named the same as the properties in the Schema. The demo publisher will automatically replace the properties in the dynamic topic with the same variables you used. 

It`s important that you assign the Event API Product to the same Environment, Modeled Event Mesh and Broker you're using as the demo publisher will receive the connection information from EP. 

5. Update the Terraform Config with your hub broker credential (all in <>) tf/hub-broker/broker_config.tf

```
provider "solacebroker" {
  username       = "mission-control-manager"                 # This is a placeholder.
  password       = "<passwords>"                 # This is a placeholder.
  url            = "https://<your-broker-url>:943"
}

variable "msg_vpn_name" {
  description = "The msgvpn of the broker"
  type        = string
  default     = "<your-hub-broker-msg-vpn>"
}

```

6. Update the Terraform Config for the Store Broker 1 and 2 (tf/solace-1 & tf/solace-2/broker_config.tf) - therefore just replace these variables (replace <> within the default tag) with the values of you hub broker:

```

variable "client_username" {
  description = "The client username for the broker"
  type        = string
  default     = "<your-hub-broker-client-username>"
}

variable "client_password" {
  description = "The password of the broker"
  type        = string
  default     = "<your-hub-broker-client-password"
}
variable "broker_url" {
  description = "The url of the broker"
  type        = string
  default     = "<your-hub-broker-url"
}

variable "msg_vpn_name" {
  description = "The msgvpn of the broker"
  type        = string
  default     = "<your-hub-broker-msg-vpn>"
}

```

7. Update the event-generator-parent/generator_config_keys.env with your Token, AppDomain, Event API Product & Hub-Broker Broker information: 

```
EVENT_PORTAL_TOKEN=<you-cloud-token>
EVENT_PORTAL_APPLICATION_DOMAIN_NAME=Acme Retail - Master Data Management
EVENT_PORTAL_EVENT_API_PRODUCT_NAME=SAP Event API Product
EVENT_PORTAL_EVENT_API_PRODUCT_VERSION=0.1.0
EVENT_PORTAL_PLAN_NAME=Guaranteed SAP Events
EVENT_PORTAL_MEM_RUNTIME_EVENT_BROKER_CREDENTIALS_NAME=Hub-Broker
EVENT_PORTAL_MEM_RUNTIME_EVENT_BROKER_CREDENTIALS_USERNAME=solace-cloud-client
EVENT_PORTAL_MEM_RUNTIME_EVENT_BROKER_CREDENTIALS_PASSWORD=<your-cloud-client-password>

```

8. Distributed Tracing: By default all components (Publisher, Brokers, Consumer) generate traces using context propagation. 
   The traces are all forwarded to DataDog (Solace SE Demo) - Filter by Trace Root Spans to get the best end to end view. 
   It`s all working out of the box - the only thing you have to configure is the endpoint of the hub-broker for otel in
   ./event-generator-parent/otel-collector-config.yaml 
   Replace: <your-hub-broker-server-name> with your server FQDN such as mr-connection-0sfxs9ayn32.messaging.solace.cloud 
   The traces are also pushed to a locally deployed jaeger container (just to show that we can use DT not only in DD). 
   If you want to push the traces to any other APM endpoint just replace the exporter config in the OTEL collector conf: 
   ./event-generator-parent/otel-collector-config.yaml 

9. Run the demo by simply execute the following script: 
cd ./event-generator-parent
./start.sh

10. Dismatle all the local objects by running the following scrip: 
./stop.sh


## AI 360 Retail UI
### Local Deploy

1. Build Dashboard

```
cd demothon-dashboard-vue
npm run build
```

2. Update `demothon-dashboard-vue/.env` & `soalce-ai/.env`
3. From project root `docker compose -f docker-compose-local.yaml`

- The docker compose project also builds the images. You may need to delete images before restarting.

### Remote Deploy

1. Build dashboard npm & docker image

```
cd demothon-dashboard-vue
npm run build
docker build -t demothon-dashboard-vue:latest -f ./Dockerfile .
```

2. Build Solace AI Connector Docker image

```
cd solace-ai
docker build -t solace-ai-connector:latest -f ./Dockerfile .
```

3. Save Docker iamges

```
docker save solace-ai-connector:latest > ./solace-ai-connector.tar
docker save demothon-dashboard-vue:latest > ./demothon-dasbhoard-vue.tar
```

4. Copy Resources to Remote:

- qdrant_config.yaml
- ./solace-ai-connector.tar
  ./demothon-dasbhoard-vue.tar

5. Update docker compose volume mapping for the solace-ai-connector

```
version: "3.8"
name: sko-team13-dashboard
services:
  solace-ai-connector:
    container_name: solace-ai-connector
    image: solace-ai-connector:latest
    env_file: .env
    volumes:
      - ./qdrant_rag.yaml:/app/config/configuration.yaml
  sko-team13-dashboard:
    container_name: demothon-dashboard
    image: demothon-dashboard-vue:latest
    env_file: .env
    ports:
      - "8080:80"

```

6. Create env file

```
VITE_SOLACE_URL="wss://localhost:443"
VITE_SOLACE_VPN="default"
VITE_SOLACE_USERNAME="solace-cloud-client"
VITE_SOLACE_PASSWORD="default"
SOLACE_BROKER_URL=tcps://localhost:55443
SOLACE_BROKER_USERNAME=solace-cloud-client
SOLACE_BROKER_PASSWORD=default
SOLACE_BROKER_VPN=default
OPENAI_API_KEY=<>
OPENAI_ENDPOINT_NAME=https://lite-llm.mymaas.net
QDRANT_API_KEY=<qdrant_api_key>
QDRANT_COLLECTION_NAME=<Collection Name>
QDRANT_URL=<qdrant_url>
OPENAI_MODEL_NAME=claude-3-5-sonnet
OPENAI_EMBEDDING_MODEL_NAME=text-embedding-ada-002
```

7. Run docker compose
8. Dashboard is available at http://<host>:80/
