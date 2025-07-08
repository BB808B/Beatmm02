'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaArrowLeft, FaFileContract, FaMoneyBillWave, FaMicrophone } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { Translations } from '@/types';

export default function RulesPage() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);

  // 加载翻译文件
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${currentLang}/common.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // 使用默认翻译
        setTranslations({
          title: '缅甸DJ平台',
          nav: {
            home: '首页',
            music: '音乐',
            dj: 'DJ',
            live: '直播',
            ranking: '排行榜',
            profile: '个人中心',
            login: '登录',
            register: '注册',
            logout: '退出'
          },
          home: {
            welcome: '欢迎来到缅甸DJ平台',
            subtitle: '发现最棒的越南鼓DJ音乐',
            featured: '精选音乐',
            trending: '热门趋势',
            newReleases: '最新发布'
          },
          auth: {
            phone: '手机号码',
            password: '密码',
            confirmPassword: '确认密码',
            login: '登录',
            register: '注册',
            forgotPassword: '忘记密码？',
            noAccount: '没有账号？',
            hasAccount: '已有账号？',
            registerNow: '立即注册',
            loginNow: '立即登录'
          },
          player: {
            play: '播放',
            pause: '暂停',
            next: '下一首',
            previous: '上一首',
            volume: '音量',
            shuffle: '随机播放',
            repeat: '重复播放'
          },
          profile: {
            myProfile: '我的资料',
            myMusic: '我的音乐',
            myWallet: '我的钱包',
            settings: '设置',
            djApplication: 'DJ认证申请',
            balance: '余额',
            recharge: '充值',
            withdraw: '提现'
          },
          common: {
            search: '搜索',
            submit: '提交',
            cancel: '取消',
            confirm: '确认',
            save: '保存',
            edit: '编辑',
            delete: '删除',
            loading: '加载中...',
            error: '错误',
            success: '成功'
          }
        });
      }
    };

    loadTranslations();
  }, [currentLang]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const goBack = () => {
    window.history.back();
  };

  if (!translations) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <Container>
          {/* 页面标题 */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center mb-3">
                <Button 
                  variant="link" 
                  className="text-light p-0 me-3"
                  onClick={goBack}
                >
                  <FaArrowLeft size={20} />
                </Button>
                <h1 className="h2 mb-0 fw-bold">
                  <FaFileContract className="me-2" style={{ color: 'var(--primary-color)' }} />
                  BeatMM Pro 平台规则与条款
                </h1>
              </div>
              <p className="text-muted">
                为了维护平台秩序，保障用户权益，请仔细阅读以下规则与条款
              </p>
            </Col>
          </Row>

          {/* 使用条款 */}
          <Row className="mb-5">
            <Col>
              <Card className="card-custom">
                <Card.Header className="bg-primary text-white">
                  <h3 className="h4 mb-0">
                    <FaFileContract className="me-2" />
                    一、使用条款
                  </h3>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex">
                      <span className="badge bg-primary me-3 mt-1">1</span>
                      <span>BeatMM Pro 是面向缅甸用户的音乐分享与DJ社区平台，仅限合法、和平用途。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge bg-primary me-3 mt-1">2</span>
                      <span>用户上传内容必须为本人原创或已获得授权。禁止盗用他人音乐、封面或介绍。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge bg-primary me-3 mt-1">3</span>
                      <span>所有打赏行为为用户自愿，不支持打赏退款。平台提供技术服务并抽取服务费用。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge bg-primary me-3 mt-1">4</span>
                      <span>用户在平台注册即表示同意遵守平台规则，如有违规行为，平台有权删除内容或封禁账号。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge bg-primary me-3 mt-1">5</span>
                      <span>禁止上传或发布任何违法、色情、暴力、仇恨、政治相关内容。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge bg-primary me-3 mt-1">6</span>
                      <span>本平台禁止用户私聊，仅允许与系统客服互动，以确保信息安全与合规。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge bg-primary me-3 mt-1">7</span>
                      <span>提现前需提供真实收款信息。若提现账户与注册身份不一致，平台有权拒绝处理。</span>
                    </li>
                    <li className="mb-0 d-flex">
                      <span className="badge bg-primary me-3 mt-1">8</span>
                      <span>BeatMM Pro 保留最终解释权，并有权随时修改条款以适应本地法规或运营策略。</span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* 打赏与提现规则 */}
          <Row className="mb-5">
            <Col>
              <Card className="card-custom">
                <Card.Header style={{ backgroundColor: 'var(--secondary-color)', color: 'white' }}>
                  <h3 className="h4 mb-0">
                    <FaMoneyBillWave className="me-2" />
                    二、打赏与提现规则
                  </h3>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--secondary-color)' }}>1</span>
                      <span>用户可通过 KPay、KBZ Banking 等方式进行账户充值，并用于打赏喜爱的 DJ。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--secondary-color)' }}>2</span>
                      <span>打赏金额由用户自由选择，打赏一经确认，不可撤销、不可退款。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--secondary-color)' }}>3</span>
                      <span>打赏收入将进入 DJ 的账户，平台将自动扣除 10% 技术服务费。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--secondary-color)' }}>4</span>
                      <span>DJ 可在余额满 3,000 MMK 后申请提现。提现金额将通过 KPay/KBZ Banking 发放。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--secondary-color)' }}>5</span>
                      <span>所有提现申请将在 24 小时内由管理员人工审核，需上传真实收款二维码。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--secondary-color)' }}>6</span>
                      <span>提现账户必须与 DJ 账号绑定手机号一致，严禁使用他人账户或虚假资料。</span>
                    </li>
                    <li className="mb-0 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--secondary-color)' }}>7</span>
                      <span>若发现刷打赏、伪造截图、虚假交易等行为，将立即封禁账号，冻结余额。</span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* DJ认证规则 */}
          <Row className="mb-5">
            <Col>
              <Card className="card-custom">
                <Card.Header style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}>
                  <h3 className="h4 mb-0">
                    <FaMicrophone className="me-2" />
                    三、DJ认证规则
                  </h3>
                </Card.Header>
                <Card.Body>
                  <ul className="list-unstyled">
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}>1</span>
                      <span>任何 BeatMM 用户均可在"申请成为DJ"页面提交申请，填写个人信息与上传音乐作品。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}>2</span>
                      <span>申请需提交：艺名、头像、至少一首原创音乐作品。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}>3</span>
                      <span>平台将于 1~2 个工作日内进行人工审核，主要审核内容包括：作品原创性、音质、是否违规。</span>
                    </li>
                    <li className="mb-3">
                      <div className="d-flex">
                        <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}>4</span>
                        <div>
                          <span>成功认证后，DJ可获得以下权限：</span>
                          <ul className="mt-2 ms-3">
                            <li>上传音乐</li>
                            <li>查看播放/点赞/打赏数据</li>
                            <li>提现打赏收入</li>
                            <li>进入 DJ 排行榜系统</li>
                          </ul>
                        </div>
                      </div>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}>5</span>
                      <span>若 DJ 上传违反规定的内容（侵权音乐、虚假资料、违规言论），将撤销认证并永久封禁。</span>
                    </li>
                    <li className="mb-3 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}>6</span>
                      <span>每位 DJ 对其上传内容负全责，平台不承担任何侵权责任。</span>
                    </li>
                    <li className="mb-0 d-flex">
                      <span className="badge me-3 mt-1" style={{ backgroundColor: 'var(--accent-color)', color: 'black' }}>7</span>
                      <span>鼓励创作越南鼓、缅甸风格、本地原创音乐作品。</span>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* 重要提醒 */}
          <Row>
            <Col>
              <Card className="card-custom border-warning">
                <Card.Body className="text-center">
                  <h4 className="text-warning mb-3">⚠️ 重要提醒</h4>
                  <p className="mb-3">
                    使用本平台即表示您已阅读、理解并同意遵守以上所有规则与条款。
                  </p>
                  <p className="mb-3">
                    平台致力于为用户提供安全、合规的音乐分享环境，共同维护良好的社区氛围。
                  </p>
                  <p className="mb-0 text-muted">
                    如有疑问，请联系客服或查看帮助文档。
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
}

