package com.leansofx.qaservicequestion.service;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * 支付服务（模拟实现）
 */
@Service
@Slf4j
public class PaymentService {
    
    /**
     * 创建支付订单
     */
    public PaymentOrder createPaymentOrder(String appointmentId, int amount) {
        log.info("创建支付订单: appointmentId={}, amount={}", appointmentId, amount);
        
        // 模拟支付订单创建
        PaymentOrder order = new PaymentOrder();
        order.setOrderId("pay_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8));
        order.setAppointmentId(appointmentId);
        order.setAmount(amount);
        order.setPaymentUrl("/payment/pay?orderId=" + order.getOrderId());
        order.setStatus("pending");
        
        log.info("支付订单创建成功: orderId={}", order.getOrderId());
        return order;
    }
    
    /**
     * 查询支付状态
     */
    public PaymentStatus queryPaymentStatus(String orderId) {
        log.info("查询支付状态: orderId={}", orderId);
        
        // 模拟支付状态查询
        PaymentStatus status = new PaymentStatus();
        status.setOrderId(orderId);
        status.setStatus("success"); // 模拟成功状态
        status.setPaidAmount(5000); // 模拟支付金额
        
        return status;
    }
    
    /**
     * 支付订单信息
     */
    @Data
    public static class PaymentOrder {
        private String orderId;
        private String appointmentId;
        private int amount; // 金额（分）
        private String paymentUrl;
        private String status;
    }
    
    /**
     * 支付状态信息
     */
    @Data
    public static class PaymentStatus {
        private String orderId;
        private String status;
        private int paidAmount;
        private String paidTime;
    }
}