package Nhom21.weboto.controller;

import Nhom21.weboto.entity.Order;
import Nhom21.weboto.repository.OrderRepository;
import Nhom21.weboto.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;
    
    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/create_url")
    public ResponseEntity<Map<String, String>> createPaymentUrl(
            @RequestParam Integer orderId,
            @RequestParam(required = false) String method,
            @RequestParam(required = false) String bankCode,
            @RequestParam String returnBaseUrl) {
        
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.badRequest().build();
        }

        long amount = order.getTotalPrice().longValue();
        String url;
        if ("MOMO".equalsIgnoreCase(method)) {
            url = paymentService.createMoMoPaymentUrl(orderId, amount, returnBaseUrl);
        } else {
            url = paymentService.createPaymentUrl(orderId, amount, bankCode, returnBaseUrl);
        }
        
        return ResponseEntity.ok(Map.of("url", url != null ? url : ""));
    }

    @GetMapping("/vnpay_return")
    public ResponseEntity<Map<String, Boolean>> vnpayReturn(@RequestParam Map<String, String> allParams) {
        boolean isSuccess = paymentService.handlePaymentReturn(allParams);
        return ResponseEntity.ok(Map.of("success", isSuccess));
    }
    
    @GetMapping("/momo_return")
    public ResponseEntity<Map<String, Boolean>> momoReturn(@RequestParam Map<String, String> allParams) {
        boolean isSuccess = paymentService.handleMoMoReturn(allParams);
        return ResponseEntity.ok(Map.of("success", isSuccess));
    }
}
