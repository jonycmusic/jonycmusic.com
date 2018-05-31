#!/bin/bash

for file in ./dist/*
do
    curl --ftp-create-dirs -T "$file" --key /tmp/sftp_rsa sftp://${SFTP_USER}:${SFTP_PASSWORD}@${SFTP_SERVER}${SFTP_PATH}$file
done; # file

