#!/bin/bash
#
# sandbox_tests.sh
#
# syntax:
#     ./sandbox_tests.sh  [<proto>://<hostname[:port]>]
#
# Defaults to http://localhost:5000 (assumes running in Docker container

# Use unofficial bash strict mode: http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -eou pipefail
IFS=$'\n\t'
# Credit to Stack Overflow user Dave Dopson http://stackoverflow.com/a/246128/424301
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
. "$DIR/common.sh"
cd "$DIR"

app_host=${1:-http://localhost:5000}

show_header() {
    printf "code\\ttotal_s\\tdl_speed\\tdl_size\\turl_effective\\n"
}

testdir="$DIR/target/"
errorlog="$testdir/errors.txt"
mkdir -p "$testdir"
cd "$testdir"
cat /dev/null > "$errorlog"

(
    show_header
    do_curl "${app_host}/about" \
        about \
        '{"Title":"Gaia Developer Challenge","Version":"v0.0.1"}'


    do_curl "${app_host}/terms/26681/longest-preview-media-url" \
        previewFetch \
        '{"bcHLS":"https://hls.gaia.com/hls/41096/master.m3u8?expiration=1494018000&token=67a88cbafec8060d90e788a0eabad6ec66755cc4c4b9f1bb17c0b8d352e11fbf"'

) | tee sandbox_tests.txt
echo "Failures: $(count_test_failures)"
  