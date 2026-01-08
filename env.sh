#!/bin/sh
# foreach env where value starts with "YTDLP_DOWNLOADER_"
for i in $(env | grep YTDLP_DOWNLOADER_)
do
    # set key and value by splitting at "="
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    echo $key=$value

    # replacce key with value in .ts and .css files
    find /usr/share/nginx/html -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
done