# hackathon-2025-team13

## Local Deploy

1. Build Dashboard

```
cd demothon-dashboard-vue
npm run build
```

2. Update `demothon-dashboard-vue/.env` & `soalce-ai/.env`
3. From project root `docker compose -f docker-compose-local.yaml`

- The docker compose project also builds the images. You may need to delete images before restarting.

## Remote Deploy

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
