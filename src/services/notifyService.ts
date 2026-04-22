/**
 * 通知服务
 * 提供预约相关的消息通知功能
 */
import { Modal, Descriptions } from 'ant-design-vue';
import { h } from 'vue';
import type { Appointment } from '../store';

/**
 * 格式化日期
 */
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${date.getMonth() + 1}月${date.getDate()}日 (${weekdays[date.getDay()]})`;
};

/**
 * 获取取号码（取预约ID后6位）
 */
const getPickupCode = (appointmentId: string): string => {
  if (!appointmentId) return '------';
  return appointmentId.slice(-6);
};

/**
 * 通知服务
 */
export const notifyService = {
  /**
   * 预约成功通知 - 使用 Modal 弹窗显示详细信息
   */
  appointmentSuccess(appointment: Appointment, onClose?: () => void): void {
    const pickupCode = getPickupCode(appointment.id);

    Modal.success({
      title: '预约成功',
      content: h('div', { style: { padding: '8px 0' } }, [
        h(Descriptions, { column: 1, size: 'small' }, () => [
          h(Descriptions.Item, { label: '医生' }, () => appointment.doctorName),
          h(Descriptions.Item, { label: '科室' }, () => appointment.department),
          h(Descriptions.Item, { label: '就诊时间' }, () => 
            `${formatDate(appointment.appointmentDate)} ${appointment.appointmentTime}`
          ),
        ]),
        h('div', {
          style: {
            marginTop: '20px',
            padding: '16px',
            background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
            borderRadius: '8px',
            textAlign: 'center',
          }
        }, [
          h('div', { style: { color: '#666', fontSize: '12px', marginBottom: '8px' } }, '请保存取号码，就诊时出示'),
          h('div', {
            style: {
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#1890ff',
              letterSpacing: '6px',
              fontFamily: "'Courier New', monospace",
            }
          }, pickupCode),
        ]),
      ]),
      okText: '查看详情',
      cancelText: '关闭',
      onOk() {
        if (onClose) {
          onClose();
        }
      },
    });
  },

  /**
   * 预约取消通知
   */
  appointmentCancelled(onClose?: () => void): void {
    Modal.info({
      title: '预约已取消',
      content: h('div', { style: { padding: '8px 0' } }, [
        h('p', { style: { margin: '0 0 12px 0', color: '#333' } }, '您的预约已成功取消。'),
        h('p', { style: { margin: '0 0 8px 0', color: '#666' } }, '如需就诊，请重新预约或联系医院。'),
        h('p', { style: { margin: '0', color: '#999' } }, '医院联系电话：400-888-9999'),
      ]),
      okText: '我知道了',
      onOk() {
        if (onClose) onClose();
      },
    });
  },

  /**
   * 取消预约失败通知
   */
  cancelFailed(error: string): void {
    Modal.error({
      title: '取消预约失败',
      content: error || '操作失败，请稍后重试',
      okText: '我知道了',
    });
  },

  /**
   * 就诊提醒通知
   */
  appointmentReminder(appointment: Appointment): void {
    Modal.warning({
      title: '就诊提醒',
      content: h('div', { style: { padding: '8px 0' } }, [
        h('p', { style: { margin: '0 0 12px 0', color: '#333' } }, '您有一项明日就诊预约：'),
        h('p', { style: { margin: '0 0 8px 0', color: '#666' } }, [
          h('strong', null, '医生：'),
          appointment.doctorName,
        ]),
        h('p', { style: { margin: '0 0 12px 0', color: '#666' } }, [
          h('strong', null, '时间：'),
          `${formatDate(appointment.appointmentDate)} ${appointment.appointmentTime}`,
        ]),
        h('p', { style: { margin: '0', color: '#52c41a', fontWeight: '500' } }, '请按时到达医院就诊。'),
      ]),
      okText: '我知道了',
    });
  },

  /**
   * 预约冲突警告
   */
  appointmentConflict(): void {
    Modal.warning({
      title: '时段已被预约',
      content: '您所选的时段已被其他患者预约，请重新选择时段。',
      okText: '我知道了',
    });
  },

  /**
   * 预约号已满
   */
  slotFull(): void {
    Modal.warning({
      title: '号源已满',
      content: '您所选的时段号源已满，请选择其他时段。',
      okText: '我知道了',
    });
  },
};

export default notifyService;
