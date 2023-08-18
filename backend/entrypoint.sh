#!/bin/sh
mkdir -p /usr/src/app/dist
cp -R /tmp/dist/* /usr/src/app/dist/
exec node /usr/src/app/dist/main