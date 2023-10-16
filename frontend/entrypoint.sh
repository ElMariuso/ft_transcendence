#!/bin/bash
# entrypoint.sh

TIMEOUT=15
QUIET=0
PROTOCOL=tcp
VERBOSE=0

echoerr() {
  if [[ $QUIET -ne 1 ]]; then echo "$@" 1>&2; fi
}

usage() {
  exitcode="$1"
  cat << USAGE >&2

Usage:
  $0 host:port [-s] [-q] [-t timeout] [-- command args]
  -h HOST | --host=HOST       Host or IP under test
  -p PORT | --port=PORT       TCP port under test
                              Alternatively, you specify the host and port as host:port
  -s | --strict               Only execute subcommand if the test succeeds
  -q | --quiet                Don't output any status messages
  -t TIMEOUT | --timeout=TIMEOUT
                              Timeout in seconds, zero for no timeout
  -v | --verbose              Increase verbosity
  -- COMMAND ARGS             Execute command with args after the test finishes

USAGE
  exit "$exitcode"
}

wait_for() {
    if [[ $VERBOSE -gt 0 ]]; then echo "waiting $TIMEOUT seconds for $HOST:$PORT"; fi
    for i in `seq $TIMEOUT` ; do
        nc -z "$HOST" "$PORT" > /dev/null 2>&1

        result=$?

        if [[ $result -eq 0 ]]; then
            if [[ $VERBOSE -gt 0 ]]; then echo "$PROTOCOL port $PORT is available"; fi
            if [[ -n $CMD ]]; then
                exec "${CMD[@]}"
            fi
            exit 0
        fi
        sleep 1
    done
    if [[ $VERBOSE -gt 0 ]]; then echo "timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT"; fi
    exit 1
}

while [[ $# -gt 0 ]]
do
    case "$1" in
        *:* )
        hostport=(${1//:/ })
        HOST=${hostport[0]}
        PORT=${hostport[1]}
        shift 1
        ;;
        --verbose)
        VERBOSE=1
        shift 1
        ;;
        -q | --quiet)
        QUIET=1
        shift 1
        ;;
        -s | --strict)
        STRICT=1
        shift 1
        ;;
        -h)
        HOST="$2"
        if [[ $HOST == "" ]]; then break; fi
        shift 2
        ;;
        --host=*)
        HOST="${1#*=}"
        shift 1
        ;;
        -p)
        PORT="$2"
        if [[ $PORT == "" ]]; then break; fi
        shift 2
        ;;
        --port=*)
        PORT="${1#*=}"
        shift 1
        ;;
        -t)
        TIMEOUT="$2"
        if [[ $TIMEOUT == "" ]]; then break; fi
        shift 2
        ;;
        --timeout=*)
        TIMEOUT="${1#*=}"
        shift 1
        ;;
        --)
        shift
        CMD=("$@")
        break
        ;;
        --help)
        usage 0
        ;;
        *)
        echoerr "Unknown argument: $1"
        usage 1
        ;;
    esac
done

if [[ "$HOST" == "" || "$PORT" == "" ]]; then
    echoerr "Error: you need to provide a host and port to test."
    usage 2
fi

wait_for
