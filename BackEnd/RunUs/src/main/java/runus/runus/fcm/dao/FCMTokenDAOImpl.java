package runus.runus.fcm.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class FCMTokenDAOImpl implements FCMTokenDAO {
    @Autowired
    private StringRedisTemplate redisTemplate;

    @Override
    public void saveToken(String userId, String token) {
        System.out.println("call saveToken(FCMTokenDaoImpl)");
        redisTemplate.opsForValue().set("fcm:token:" + userId, token);
    }

    @Override
    public String getToken(String userId) {
        System.out.println("call getToken(FCMTokenDaoImpl)");
        return redisTemplate.opsForValue().get("fcm:token:" + userId);
    }

    @Override
    public void deleteToken(String userId) {
        System.out.println("call deleteToken(FCMTokenDaoImpl)");
        redisTemplate.delete("fcm:token:" + userId);
    }
}