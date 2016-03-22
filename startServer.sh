echo "start in docker...........monogodb server"
socker stop some-mongo
docker rm some-mongo
docker run --name some-mongo -p 27017:27017 -v /home/zyg/mongodir:/data/db -d mongo
echo "start in docker...........monogodb redis"
docker stop tommorr-redis
docker rm tommorr-redis
docker run --name tommorr-redis  -p 6379:6379 -v /home/zyg/redisdir:/data  -d  redis
echo "start server is success...."

