import Redis from 'ioredis';


const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

await redis.set('ping', 'pong');
console.log(await redis.get('ping'));