<template>
  <div class="about-page">
    <div class="page-header">
      <h1>关于我们</h1>
      <p>专业、便捷、值得信赖的在线医疗问诊平台</p>
    </div>

    <div class="about-content">
      <section class="section">
        <h2>平台简介</h2>
        <p>
          QA Live Healthcare 是一个专业的在线医疗问诊平台,致力于为患者提供便捷、高效的医疗咨询服务。
          我们通过连接专业医生与患者,打破地域限制,让优质的医疗资源触手可及。
        </p>
      </section>

      <section class="section features-section">
        <h2>平台特色</h2>
        <div class="features-grid">
          <div class="feature-card">
            <TeamOutlined class="feature-icon" />
            <h3>专业医生团队</h3>
            <p>汇聚各科室资深医生,均具备丰富的临床经验和专业资质</p>
          </div>
          <div class="feature-card">
            <ClockCircleOutlined class="feature-icon" />
            <h3>实时在线问诊</h3>
            <p>7x24小时在线服务,医生快速响应,及时解答您的健康问题</p>
          </div>
          <div class="feature-card">
            <SafetyCertificateOutlined class="feature-icon" />
            <h3>隐私安全保护</h3>
            <p>严格的信息安全措施,保护您的个人隐私和医疗信息</p>
          </div>
          <div class="feature-card">
            <MobileOutlined class="feature-icon" />
            <h3>便捷易用</h3>
            <p>简洁的操作界面,随时随地通过手机或电脑进行问诊</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>服务流程</h2>
        <div class="process-steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>选择医生</h3>
            <p>浏览医生列表,选择适合的专科医生</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>提交问题</h3>
            <p>详细描述您的症状和问题</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>医生解答</h3>
            <p>医生会及时查看并回复您的问题</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h3>查看回复</h3>
            <p>在个人中心查看医生的专业建议</p>
          </div>
        </div>
      </section>

      <section class="section contact-section">
        <h2>联系我们</h2>
        <div class="contact-info">
          <div class="contact-item">
            <PhoneOutlined class="contact-icon" />
            <div>
              <h4>客服热线</h4>
              <p>400-123-4567</p>
            </div>
          </div>
          <div class="contact-item">
            <MailOutlined class="contact-icon" />
            <div>
              <h4>电子邮箱</h4>
              <p>service@qalive.com</p>
            </div>
          </div>
          <div class="contact-item">
            <EnvironmentOutlined class="contact-icon" />
            <div>
              <h4>服务时间</h4>
              <p>周一至周日 8:00-22:00</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TeamOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue';
</script>

<style scoped>
.about-page {
  min-height: calc(100vh - 64px);
  padding-top: 64px;
  background: #f0f2f5;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 24px;
  text-align: center;
  color: #fff;
}

.page-header h1 {
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
}

.page-header p {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.about-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

.section {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section h2 {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
}

.section p {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.feature-card {
  text-align: center;
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition: all 0.3s;
}

.feature-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 48px;
  color: #1890ff;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.step {
  text-align: center;
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.step h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.step p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.contact-icon {
  font-size: 32px;
  color: #1890ff;
}

.contact-item h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.contact-item p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 32px;
  }

  .page-header p {
    font-size: 16px;
  }

  .section {
    padding: 24px;
  }

  .section h2 {
    font-size: 24px;
  }

  .features-grid,
  .process-steps,
  .contact-info {
    grid-template-columns: 1fr;
  }
}
</style>
