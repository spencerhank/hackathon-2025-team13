# Run for Development

1. Update `.env`
2. `npm run dev`

# Run in Container

1. Update `.env`
2. Set username & password in Dockerfile
3. `npm run build`
4. `docker compose up -d docker-compose.yaml`
5. Navigate to http://localhost:8080

- The docker file copies in nginx.conf and ./dist to the container. Overwrite with the following and use non-basicauth nginx with the following

```
version: "3.8"
name: sko-team13-dashboard
services:
  sko-team13-dashboard:
    container_name: sko-team13-dashboard
    image: nginx:alpine
    env_file: .env
    ports:
      - "8080:80"
    volumes:
    # Only needed if you need to overrite defaults
     - ./dist:/usr/share/nginx/html
     - ./nginx.conf:/etc/nginx/conf.d/default.conf

```
