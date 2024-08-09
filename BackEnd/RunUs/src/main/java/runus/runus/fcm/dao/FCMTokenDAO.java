package runus.runus.fcm.dao;

public interface FCMTokenDAO {
    void saveToken(String userId, String token);
    String getToken(String userId);
    void deleteToken(String userId);
}
