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
        redisTemplate.opsForValue().set("fcm:token:" + userId, token);
    }

    @Override
    public String getToken(String userId) {
        return redisTemplate.opsForValue().get("fcm:token:" + userId);
    }

    @Override
    public void deleteToken(String userId) {
        redisTemplate.delete("fcm:token:" + userId);
    }
}