#!/bin/bash

docker run -d -p 8080:80 --name amapp -v $PWD/../../www:/var/www/amapp emontech/amapp

