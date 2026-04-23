package com.leansofx.qaservicequestion.enums;

/**
 * 时段枚举
 */
public enum TimePeriod {
    /** 上午 */
    MORNING("morning", "上午", "08:00-12:00"),
    /** 下午 */
    AFTERNOON("afternoon", "下午", "14:00-18:00"),
    /** 晚上 */
    EVENING("evening", "晚上", "18:00-20:00");

    private final String code;
    private final String description;
    private final String timeRange;

    TimePeriod(String code, String description, String timeRange) {
        this.code = code;
        this.description = description;
        this.timeRange = timeRange;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public String getTimeRange() {
        return timeRange;
    }

    public static TimePeriod fromCode(String code) {
        for (TimePeriod period : values()) {
            if (period.code.equals(code)) {
                return period;
            }
        }
        return MORNING;
    }
}