#!/bin/bash

# Check if an environment argument is provided
if [ -z "$1" ]; then
    echo "Usage: $0 {dev|prod} {start|stop|restart|clean-volumes|remove-volumes|remove-images}"
    exit 1
fi

# Check if a valid environment argument is provided
if [ "$1" != "dev" ] && [ "$1" != "prod" ]; then
    echo "Usage: $0 {dev|prod} {start|stop|restart|clean-volumes|remove-volumes|remove-images}"
    exit 1
fi

# Set the environment variable to use the correct docker-compose file
if [ "$1" == "dev" ]; then
    DOCKER_COMPOSE_FILE="docker-compose.dev.yml"
else
    DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
fi

case $2 in
    start)
        docker-compose -f "$DOCKER_COMPOSE_FILE" up --build -d
        ;;
    stop)
        docker-compose -f "$DOCKER_COMPOSE_FILE" down
        ;;
    restart)
        docker-compose -f "$DOCKER_COMPOSE_FILE" down
        docker-compose -f "$DOCKER_COMPOSE_FILE" up --build -d
        ;;
    clean-volumes)
        rm -rf ./frontend/logs database logs-front logs-back uploads frontend-live ./frontend/.next ./frontend/node_modules ./frontend/next-env.d.ts ./backend/uploads ./backend/dist ./backend/logs ./backend/node_modules
        ;;
    remove-volumes)
        docker-compose -f "$DOCKER_COMPOSE_FILE" down -v
        ;;
    remove-images)
        docker-compose -f "$DOCKER_COMPOSE_FILE" down --rmi all
        ;;
    computer-clean)
        docker system prune --volumes
        ;;
    *)
        echo "Usage: $0 {dev|prod} {start|stop|restart|clean-volumes|remove-volumes|remove-images}"
        exit 1
esac
