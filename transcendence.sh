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
        rm -rf database logs-front logs-back uploads
        ;;
    remove-volumes)
        docker-compose -f "$DOCKER_COMPOSE_FILE" down -v
        ;;
    remove-images)
        docker-compose -f "$DOCKER_COMPOSE_FILE" down --rmi all
        ;;
    *)
        echo "Usage: $0 {dev|prod} {start|stop|restart|clean-volumes|remove-volumes|remove-images}"
        exit 1
esac
