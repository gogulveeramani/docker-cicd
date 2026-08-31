docker compose ps

docker compose logs api

docker inspect docker-production-api

docker inspect docker-production-api \
  --format '{{range .Config.Env}}{{println .}}{{end}}'

docker compose logs postgres
