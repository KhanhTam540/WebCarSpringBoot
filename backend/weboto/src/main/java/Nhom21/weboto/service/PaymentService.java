package Nhom21.weboto.service;

import Nhom21.weboto.config.VNPayConfig;
import Nhom21.weboto.entity.Order;
import Nhom21.weboto.entity.OrderStatus;
import Nhom21.weboto.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class PaymentService {
    @Autowired
    private OrderRepository orderRepository;

    public String createPaymentUrl(Integer orderId, long amount, String bankCode, String returnBaseUrl) {
        // Return Mock URL for UI testing as requested by user
        return returnBaseUrl + "/payment/mock?orderId=" + orderId + "&amount=" + amount + "&method=VNBANK&bankCode=" + (bankCode != null ? bankCode : "");
        /* Original logic follow for reference or if real keys are provided later:
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef = VNPayConfig.getRandomNumber(8) + "_" + orderId;
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VNPayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100)); // VNPAY expects amount * 100
        vnp_Params.put("vnp_CurrCode", "VND");
        
        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + orderId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", returnBaseUrl + VNPayConfig.vnp_ReturnUrl); // Frontend return
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
        
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        return VNPayConfig.vnp_PayUrl + "?" + queryUrl;
        */
    }

    public boolean handlePaymentReturn(Map<String, String> params) {
        // Support for Mock Success
        if ("mock_hash".equals(params.get("vnp_SecureHash"))) {
            String txnRef = params.get("vnp_TxnRef");
            if (txnRef != null && txnRef.startsWith("MOCK_")) {
                Integer orderId = Integer.parseInt(txnRef.split("_")[1]);
                updateToPaid(orderId);
                return true;
            }
        }

        String secureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }
        String calculatedHash = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashData.toString());
        
        if (calculatedHash.equals(secureHash)) {
            if ("00".equals(params.get("vnp_ResponseCode"))) {
                // Payment success
                String txnRef = params.get("vnp_TxnRef");
                String orderIdStr = txnRef.split("_")[1];
                Integer orderId = Integer.parseInt(orderIdStr);
                
                Order order = orderRepository.findById(orderId).orElse(null);
                if (order != null && order.getStatus() == OrderStatus.PENDING) {
                    order.setStatus(OrderStatus.PAID);
                    orderRepository.save(order);
                }
                return true;
            }
        }
        return false;
    }

    public String createMoMoPaymentUrl(Integer orderId, long amount, String returnBaseUrl) {
        // Return Mock URL for UI testing as requested by user
        return returnBaseUrl + "/payment/mock?orderId=" + orderId + "&amount=" + amount + "&method=MOMO";
        /* Original logic follows:
        // Prepare data
        String requestId = String.valueOf(System.currentTimeMillis());
        String orderIdStr = requestId + "_" + orderId;
        String redirectUrl = returnBaseUrl + Nhom21.weboto.config.MoMoConfig.returnUrl;
        String ipnUrl = returnBaseUrl + Nhom21.weboto.config.MoMoConfig.returnUrl;
        String amountStr = String.valueOf(amount);
        String orderInfo = "Thanh toan don hang " + orderId;
        String requestType = "captureWallet";
        String extraData = "";

        // Build signature string
        String rawHash = "accessKey=" + Nhom21.weboto.config.MoMoConfig.accessKey +
                "&amount=" + amountStr +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderIdStr +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + Nhom21.weboto.config.MoMoConfig.partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = Nhom21.weboto.config.MoMoConfig.hmacSHA256(Nhom21.weboto.config.MoMoConfig.secretKey, rawHash);

        // Build JSON body string
        String requestBody = String.format(
            "{\"partnerCode\":\"%s\",\"partnerName\":\"Test\",\"storeId\":\"MomoTestStore\",\"requestId\":\"%s\",\"amount\":%s,\"orderId\":\"%s\",\"orderInfo\":\"%s\",\"redirectUrl\":\"%s\",\"ipnUrl\":\"%s\",\"lang\":\"vi\",\"extraData\":\"%s\",\"requestType\":\"%s\",\"signature\":\"%s\"}",
            Nhom21.weboto.config.MoMoConfig.partnerCode, requestId, amountStr, orderIdStr, orderInfo, redirectUrl, ipnUrl, extraData, requestType, signature
        );

        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(requestBody, headers);
            
            // Post to MoMo
            org.springframework.http.ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                Nhom21.weboto.config.MoMoConfig.endpoint,
                org.springframework.http.HttpMethod.POST,
                entity,
                new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {}
            );
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("payUrl")) {
                return (String) body.get("payUrl");
            }
        } catch (Exception e) {
            System.err.println("Momo API Call Failed: " + e.getMessage());
            return null;
        }
        
        return null;
        */
    }

    public boolean handleMoMoReturn(Map<String, String> params) {
        // Support for Mock Success
        if ("mock_sig".equals(params.get("signature"))) {
            String orderIdStr = params.get("orderId");
            if (orderIdStr != null) {
                Integer actualOrderId = Integer.parseInt(orderIdStr); 
                updateToPaid(actualOrderId);
                return true;
            }
        }

        String partnerCode = params.get("partnerCode");
        String orderIdStr = params.get("orderId");
        String requestId = params.get("requestId");
        String amount = params.get("amount");
        String orderInfo = params.get("orderInfo");
        String orderType = params.get("orderType");
        String transId = params.get("transId");
        String resultCode = params.get("resultCode");
        String message = params.get("message");
        String payType = params.get("payType");
        String responseTime = params.get("responseTime");
        String extraData = params.get("extraData");
        String secureHash = params.get("signature");

        // Simple validation for our dummy keys fallback
        if ("dummy_sig".equals(secureHash)) {
            if ("0".equals(resultCode)) {
                Integer actualOrderId = Integer.parseInt(orderIdStr.split("_")[1]);
                updateToPaid(actualOrderId);
                return true;
            }
            return false;
        }

        String rawHash = "accessKey=" + Nhom21.weboto.config.MoMoConfig.accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&message=" + message +
                "&orderId=" + orderIdStr +
                "&orderInfo=" + orderInfo +
                "&orderType=" + orderType +
                "&partnerCode=" + partnerCode +
                "&payType=" + payType +
                "&requestId=" + requestId +
                "&responseTime=" + responseTime +
                "&resultCode=" + resultCode +
                "&transId=" + transId;

        String calculatedHash = Nhom21.weboto.config.MoMoConfig.hmacSHA256(Nhom21.weboto.config.MoMoConfig.secretKey, rawHash);

        if (calculatedHash.equals(secureHash)) {
            if ("0".equals(resultCode)) {
                Integer actualOrderId = Integer.parseInt(orderIdStr.split("_")[1]);
                updateToPaid(actualOrderId);
                return true;
            }
        }
        return false;
    }

    private void updateToPaid(Integer orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order != null && order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
        }
    }
}
