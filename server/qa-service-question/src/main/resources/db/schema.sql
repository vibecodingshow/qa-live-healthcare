-- 创建号源相关的数据库表结构

-- 排班表
CREATE TABLE IF NOT EXISTS schedule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    doctor_id BIGINT NOT NULL COMMENT '医生ID',
    schedule_date DATE NOT NULL COMMENT '排班日期',
    time_period VARCHAR(20) NOT NULL COMMENT '时段（上午/下午/晚上）',
    total_slots INT NOT NULL DEFAULT 0 COMMENT '总号源数量',
    remaining_slots INT NOT NULL DEFAULT 0 COMMENT '剩余号源数量',
    status VARCHAR(20) NOT NULL DEFAULT 'available' COMMENT '状态（available/full/suspended）',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否有效',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    UNIQUE KEY uk_doctor_date_period (doctor_id, schedule_date, time_period),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_schedule_date (schedule_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='医生排班表';

-- 号源表（更细粒度的时段控制）
CREATE TABLE IF NOT EXISTS schedule_slot (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL COMMENT '排班ID',
    start_time TIME NOT NULL COMMENT '开始时间',
    end_time TIME NOT NULL COMMENT '结束时间',
    slot_status VARCHAR(20) NOT NULL DEFAULT 'available' COMMENT '号源状态（available/reserved/confirmed）',
    patient_id BIGINT NULL COMMENT '患者ID（如果已预约）',
    appointment_id BIGINT NULL COMMENT '预约ID',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否锁定（防止重复预约）',
    locked_until TIMESTAMP NULL COMMENT '锁定过期时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE,
    INDEX idx_schedule_id (schedule_id),
    INDEX idx_patient_id (patient_id),
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_slot_status (slot_status),
    INDEX idx_locked_until (locked_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='号源明细表';

-- 医生表（简化版，实际项目中可能在其他服务）
CREATE TABLE IF NOT EXISTS doctor (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '医生姓名',
    department_id BIGINT NOT NULL COMMENT '科室ID',
    department_name VARCHAR(100) NOT NULL COMMENT '科室名称',
    title VARCHAR(50) COMMENT '职称',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    introduction TEXT COMMENT '医生介绍',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否在职',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_department_id (department_id),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='医生表';

-- 插入测试数据
INSERT IGNORE INTO doctor (id, name, department_id, department_name, title, introduction) VALUES
(1, '张医生', 1, '内科', '主任医师', '擅长内科常见病、多发病的诊断与治疗'),
(2, '李医生', 1, '内科', '副主任医师', '专注于心血管疾病的诊断和治疗'),
(3, '王医生', 2, '外科', '主治医师', '外科手术经验丰富，擅长微创手术');

-- 插入测试排班数据（未来7天）
INSERT IGNORE INTO schedule (doctor_id, schedule_date, time_period, total_slots, remaining_slots, status) VALUES
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '上午', 20, 15, 'available'),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '下午', 15, 8, 'available'),
(1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '上午', 20, 20, 'available'),
(1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '下午', 15, 3, 'limited'),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '上午', 25, 10, 'available'),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '下午', 20, 0, 'full'),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '上午', 15, 15, 'suspended');