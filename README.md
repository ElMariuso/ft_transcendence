FT_TRANSCENDENCE

USAGE:

./transcendence dev {start|stop|...}
	-Launching as prod does not migrate the DB correctly at the moment, so don't use it.

Launches the Docker containers as DEV mode, meaning our local files are linked with the files inside the docker containers and any changes to them are updated live, without needing to restart the Docker.

Access backend at localhost:3000
Access frontend at localhost:8080

WIP