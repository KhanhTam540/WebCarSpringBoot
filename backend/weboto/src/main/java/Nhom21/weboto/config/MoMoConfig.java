package Nhom21.weboto.config;

import org.springframework.context.annotation.Configuration;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
public class MoMoConfig {
    public static final String endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
    public static final String returnUrl = "/orders/payment-return"; // FE callback
    public static final String partnerCode = "MOMOBKUN20180529";
    public static final String accessKey = "klm05TvNBqg7n6J2";
    public static final String secretKey = "at67qH6vSRU0c7SU9K9RE9at9p9G99YF";

    public static String hmacSHA256(final String key, final String data) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
}
