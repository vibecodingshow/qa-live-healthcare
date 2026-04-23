package com.leansofx.qaservicequestion.dto;

import com.leansofx.qaservicequestion.enums.ScheduleStatus;
import com.leansofx.qaservicequestion.enums.TimePeriod;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * 号源数据传输对象
 */
@Data
public class ScheduleSlotDTO {
    
    /** 排班ID */
    private Long scheduleId;
    
    /** 医生ID */
    private Long doctorId;
    
    /** 医生姓名 */
    private String doctorName;
    
    /** 科室ID */
    private Long departmentId;
    
    /** 科室名称 */
    private String departmentName;
    
    /** 排班日期 */
    private LocalDate scheduleDate;
    
    /** 时段 */
    private TimePeriod timePeriod;
    
    /** 总号源数量 */
    private Integer totalSlots;
    
    /** 剩余号源数量 */
    private Integer remainingSlots;
    
    /** 排班状态 */
    private ScheduleStatus status;
    
    /** 号源明细列表 */
    private List<SlotDetailDTO> slotDetails;
    
    /**
     * 号源明细DTO
     */
    @Data
    public static class SlotDetailDTO {
        
        /** 号源ID */
        private Long slotId;
        
        /** 开始时间 */
        private LocalTime startTime;
        
        /** 结束时间 */
        private LocalTime endTime;
        
        /** 号源状态 */
        private String slotStatus;
        
        /** 是否锁定 */
        private Boolean isLocked;
        
        /** 锁定过期时间 */
        private String lockedUntil;
        
        /** 是否可用 */
        private Boolean available;
    }
}