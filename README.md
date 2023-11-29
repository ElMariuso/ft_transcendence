FT_TRANSCENDENCE

USAGE:

./transcendence dev { start| stop|...}
	Launches the Docker containers as DEV mode, meaning our local files are linked with the files inside the docker containers and any changes to them are updated live, without needing to restart the Docker.

./transcendence prod { start| stop|...}
	Launches the Docker containers as PROD mode.

Access backend at localhost:3000
Access frontend at localhost:8080