# VERSION 0.0.1
FROM ubuntu:14.04
MAINTAINER zengyonggaung "zaq19999@163.com"
RUN  apt-get update
RUN  apt-get install curl -y
RUN  apt-get install git -y
RUN  curl -L http://git.io/n-install | bash
RUN  n 4.1.0





