package com.leansofx.qaservicequestion.enums;

/**
 * 排班状态枚举
 */
public enum ScheduleStatus {
    /** 可预约 */
    AVAILABLE("available", "可预约"),
    /** 号源紧张 */
    LIMITED("limited", "号源紧张"),
    /** 已满 */
    FULL("full", "已满"),
    /** 停诊 */
    SUSPENDED("suspended", "停诊");

    private final String code;
    private final String description;

    ScheduleStatus(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public static ScheduleStatus fromCode(String code) {
        for (ScheduleStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return AVAILABLE;
    }
}