# 号源实时查询API文档

## 概述

号源实时查询API为前端提供准确的号源数据查询能力，包括号源数量、预约状态、时间段信息等。

## API接口列表

### 1. 根据医生ID查询号源列表

**接口**: `GET /api/schedule/doctor/{doctorId}/slots`

**参数**:
- `doctorId` (路径参数): 医生ID
- `startDate` (查询参数, 可选): 开始日期，格式: yyyy-MM-dd，默认: 今天
- `endDate` (查询参数, 可选): 结束日期，格式: yyyy-MM-dd，默认: 开始日期后7天

**响应示例**:
```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "scheduleId": 1,
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentId": 1,
      "departmentName": "内科",
      "scheduleDate": "2024-01-02",
      "timePeriod": "MORNING",
      "totalSlots": 20,
      "remainingSlots": 15,
      "status": "AVAILABLE",
      "slotDetails": [
        {
          "slotId": 1,
          "startTime": "08:00:00",
          "endTime": "08:30:00",
          "slotStatus": "available",
          "isLocked": false,
          "lockedUntil": null,
          "available": true
        }
      ]
    }
  ]
}
```

### 2. 根据科室ID查询号源列表

**接口**: `GET /api/schedule/department/{departmentId}/slots`

**参数**:
- `departmentId` (路径参数): 科室ID
- `startDate` (查询参数, 可选): 开始日期，格式: yyyy-MM-dd，默认: 今天
- `endDate` (查询参数, 可选): 结束日期，格式: yyyy-MM-dd，默认: 开始日期后7天
- `page` (查询参数, 可选): 页码，默认: 0
- `size` (查询参数, 可选): 每页大小，默认: 20

### 3. 查询可用号源列表（分页）

**接口**: `GET /api/schedule/available`

**参数**:
- `startDate` (查询参数, 可选): 开始日期，格式: yyyy-MM-dd，默认: 今天
- `endDate` (查询参数, 可选): 结束日期，格式: yyyy-MM-dd，默认: 开始日期后7天
- `page` (查询参数, 可选): 页码，默认: 0
- `size` (查询参数, 可选): 每页大小，默认: 20

### 4. 查询医生未来N天的排班

**接口**: `GET /api/schedule/doctor/{doctorId}/upcoming`

**参数**:
- `doctorId` (路径参数): 医生ID
- `days` (查询参数, 可选): 天数范围，默认: 7，最大: 30

### 5. 刷新号源缓存

**接口**: `POST /api/schedule/cache/refresh`

**用途**: 手动刷新Redis缓存中的号源数据

## 数据模型

### 排班状态 (ScheduleStatus)
- `AVAILABLE`: 可预约
- `LIMITED`: 号源紧张
- `FULL`: 已满
- `SUSPENDED`: 停诊

### 时段 (TimePeriod)
- `MORNING`: 上午 (08:00-12:00)
- `AFTERNOON`: 下午 (14:00-18:00)
- `EVENING`: 晚上 (18:00-20:00)

## 错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 500 | 服务器内部错误 |

## 缓存策略

- **缓存时间**: 5分钟
- **缓存键**: `schedule:slots:{查询条件}`
- **缓存刷新**: 数据变更时自动刷新，也可手动调用刷新接口

## 性能要求

- API响应时间 < 200ms
- 支持高并发查询（1000+ QPS）
- 使用Redis缓存减轻数据库压力

## 示例调用

### 查询医生1未来7天的号源
```bash
curl -X GET "http://localhost:8080/api/schedule/doctor/1/slots"
```

### 查询内科科室未来7天的号源
```bash
curl -X GET "http://localhost:8080/api/schedule/department/1/slots?page=0&size=20"
```

### 刷新缓存
```bash
curl -X POST "http://localhost:8080/api/schedule/cache/refresh"
```