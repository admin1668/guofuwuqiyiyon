

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const HelpTutorialPage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '帮助与教程 - 漫影叙';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleFaqToggle = (index: number) => {
    setExpandedFaqIndex(expandedFaqIndex === index ? null : index);
  };

  const handleVideoPlay = (videoTitle: string) => {
    console.log('播放视频教程:', videoTitle);
    alert(`即将播放视频教程：${videoTitle}`);
  };

  const handleDownloadFullManual = () => {
    console.log('下载完整用户手册');
    alert('完整用户手册下载开始...');
  };

  const handleDownloadQuickGuide = () => {
    console.log('下载快速入门指南');
    alert('快速入门指南下载开始...');
  };

  const handleOnlineChat = () => {
    console.log('打开在线客服聊天');
    alert('即将为您转接在线客服...');
  };

  const handleEmailContact = () => {
    console.log('打开邮件客户端');
    window.location.href = 'mailto:support@manyingxu.com?subject=漫影叙客服咨询';
  };

  const handlePhoneContact = () => {
    console.log('拨打电话');
    window.location.href = 'tel:400-888-8888';
  };

  const handleNotificationsClick = () => {
    console.log('打开通知面板');
    alert('通知功能');
  };

  const handleUserMenuClick = () => {
    console.log('打开用户菜单');
    alert('用户菜单功能');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('feedback-name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('feedback-email') as HTMLInputElement).value;
    const type = (form.elements.namedItem('feedback-type') as HTMLSelectElement).value;
    const content = (form.elements.namedItem('feedback-content') as HTMLTextAreaElement).value;
    
    if (!name || !email || !type || !content) {
      alert('请填写完整的反馈信息');
      return;
    }
    
    console.log('提交反馈:', { name, email, type, content });
    alert('感谢您的反馈！我们将尽快处理您的问题。');
    
    form.reset();
  };

  const faqData = [
    {
      question: '如何开始使用视频分镜生成功能？',
      answer: (
        <div className="py-4 text-text-secondary leading-relaxed">
          <p>1. 点击顶部导航栏的"视频分镜生成"或左侧菜单的对应选项。</p>
          <p>2. 在文本输入区粘贴您的小说段落或描述性文本。</p>
          <p>3. 选择您喜欢的画风（如日漫、古风、写实等）。</p>
          <p>4. 点击"生成分镜"按钮，等待AI处理完成。</p>
          <p>5. 预览生成的分镜，可以调整顺序或进行细节修改。</p>
          <p>6. 满意后点击"导出分镜"保存您的作品。</p>
        </div>
      )
    },
    {
      question: '图文转视频支持哪些语音和语言？',
      answer: (
        <div className="py-4 text-text-secondary leading-relaxed">
          <p>漫影叙提供2000+种AI语音选择，支持多种语言：</p>
          <p>• 中文（普通话、粤语、台湾腔等）</p>
          <p>• 英文（美式、英式、澳式等）</p>
          <p>• 日语、韩语、法语、德语、西班牙语等</p>
          <p>每种语音都可以调整语速、音量和情感基调（低沉、欢快、悲伤等）。您还可以为不同角色分配不同的语音，实现对话效果。</p>
        </div>
      )
    },
    {
      question: '如何调整生成视频的质量和格式？',
      answer: (
        <div className="py-4 text-text-secondary leading-relaxed">
          <p>在导出设置中，您可以调整以下参数：</p>
          <p>• 分辨率：支持720p、1080p、2K等多种分辨率</p>
          <p>• 格式：MP4、MOV等常见视频格式</p>
          <p>• 码率：影响视频质量和文件大小</p>
          <p>• 帧率：24fps、30fps、60fps可选</p>
          <p>建议根据您的使用场景选择合适的参数，社交媒体分享建议使用1080p MP4格式。</p>
        </div>
      )
    },
    {
      question: '我的作品保存在哪里？如何管理？',
      answer: (
        <div className="py-4 text-text-secondary leading-relaxed">
          <p>您的所有作品都会自动保存到云端，确保数据安全：</p>
          <p>• 点击左侧菜单的"作品管理"查看所有作品</p>
          <p>• 支持按名称、类型、创建时间搜索和筛选</p>
          <p>• 可以预览、编辑、删除、重命名作品</p>
          <p>• 支持本地下载和分享到社交媒体</p>
          <p>即使更换设备，只要登录账号就能访问所有作品。</p>
        </div>
      )
    },
    {
      question: '生成速度受哪些因素影响？',
      answer: (
        <div className="py-4 text-text-secondary leading-relaxed">
          <p>生成时间主要受以下因素影响：</p>
          <p>• 文本长度：内容越长，生成时间越长</p>
          <p>• 分镜数量：选择的分镜数量越多，处理时间越长</p>
          <p>• 分辨率：高分辨率视频需要更多处理时间</p>
          <p>• 服务器负载：高峰期可能需要稍长等待时间</p>
          <p>一般情况下，分镜生成需要30秒到5分钟，视频生成需要1-10分钟。您可以在生成过程中继续其他操作。</p>
        </div>
      )
    }
  ];

  const videoTutorials = [
    {
      id: 1,
      title: '视频分镜生成基础教程',
      description: '从零开始学习如何使用视频分镜生成功能，包含文本输入、风格选择等基础操作。',
      thumbnail: 'https://s.coze.cn/image/4JWupu_Mnfc/',
      duration: '12:35',
      views: '1.2万次观看',
      date: '3天前'
    },
    {
      id: 2,
      title: '图文转视频高级技巧',
      description: '学习如何优化配音效果、选择合适的背景音乐，以及视频参数调整技巧。',
      thumbnail: 'https://s.coze.cn/image/wrqxNnt-yaI/',
      duration: '18:42',
      views: '8.5千次观看',
      date: '1周前'
    },
    {
      id: 3,
      title: '作品管理与批量操作',
      description: '掌握作品的高效管理方法，包括搜索、筛选、批量导出和分享技巧。',
      thumbnail: 'https://s.coze.cn/image/JqrJwzDvFxw/',
      duration: '15:28',
      views: '6.3千次观看',
      date: '5天前'
    },
    {
      id: 4,
      title: '素材库使用指南',
      description: '学习如何搜索、预览、收藏和上传素材，丰富您的创作资源。',
      thumbnail: 'https://s.coze.cn/image/UYHFEiBUiqY/',
      duration: '10:15',
      views: '4.7千次观看',
      date: '1周前'
    },
    {
      id: 5,
      title: 'AI配音优化技巧',
      description: '深入了解AI配音的各种参数调整，让语音更加自然生动。',
      thumbnail: 'https://s.coze.cn/image/__QbQp5Vrec/',
      duration: '14:56',
      views: '9.2千次观看',
      date: '2天前'
    },
    {
      id: 6,
      title: '高级分镜编辑技巧',
      description: '学习分镜的精细调整、元素替换和风格修改等高级操作。',
      thumbnail: 'https://s.coze.cn/image/QLcCbU5DTLo/',
      duration: '20:12',
      views: '7.8千次观看',
      date: '4天前'
    }
  ];

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16">
        <div className="flex items-center justify-between h-full px-6">
          {/* 左侧：Logo和产品名称 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSidebarToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-video text-white text-lg"></i>
              </div>
              <h1 className={`text-xl font-bold ${styles.gradientText}`}>漫影叙</h1>
            </div>
          </div>
          
          {/* 中间：主导航 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-text-secondary hover:text-primary py-1 transition-colors">首页</Link>
            <Link to="/scene-generation" className="text-text-secondary hover:text-primary py-1 transition-colors">视频分镜生成</Link>
            <Link to="/video-generation" className="text-text-secondary hover:text-primary py-1 transition-colors">图文转视频</Link>
            <Link to="/asset-library" className="text-text-secondary hover:text-primary py-1 transition-colors">素材库</Link>
          </nav>
          
          {/* 右侧：用户操作区 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleNotificationsClick}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
            >
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            <div 
              onClick={handleUserMenuClick}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <img 
                src="https://s.coze.cn/image/QWSiyUngRbI/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full border-2 border-gray-200"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">创作者</span>
              <i className="fas fa-chevron-down text-xs text-gray-500"></i>
            </div>
          </div>
        </div>
      </header>

      {/* 左侧菜单 */}
      <aside className={`fixed left-0 top-16 bottom-0 bg-white shadow-lg z-40 transition-all duration-300 ${
        isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded
      }`}>
        <div className="p-4">
          <nav className="space-y-2">
            <Link to="/home" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-home text-gray-600 text-lg"></i>
              <span className={`${styles.sidebarText} text-gray-700 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>首页</span>
            </Link>
            <Link to="/scene-generation" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-film text-gray-600 text-lg"></i>
              <span className={`${styles.sidebarText} text-gray-700 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>视频分镜生成</span>
            </Link>
            <Link to="/video-generation" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-magic text-gray-600 text-lg"></i>
              <span className={`${styles.sidebarText} text-gray-700 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>图文转视频</span>
            </Link>
            <Link to="/works-management" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-folder text-gray-600 text-lg"></i>
              <span className={`${styles.sidebarText} text-gray-700 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>作品管理</span>
            </Link>
            <Link to="/asset-library" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-images text-gray-600 text-lg"></i>
              <span className={`${styles.sidebarText} text-gray-700 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>素材库</span>
            </Link>
            <Link to="/user-center" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-user text-gray-600 text-lg"></i>
              <span className={`${styles.sidebarText} text-gray-700 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>个人中心</span>
            </Link>
            <Link to="/help-tutorial" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-question-circle text-primary text-lg"></i>
              <span className={`${styles.sidebarText} text-primary font-medium ${isSidebarCollapsed ? 'hidden' : 'block'}`}>帮助教程</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className={`${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded} pt-16 min-h-screen transition-all duration-300`}>
        {/* 页面头部 */}
        <section className="bg-white border-b border-border-light py-6 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">帮助与教程</h1>
                <nav className="flex items-center space-x-2 text-sm text-text-secondary mt-2">
                  <Link to="/home" className="hover:text-primary">首页</Link>
                  <i className="fas fa-chevron-right text-xs"></i>
                  <span className="text-text-primary">帮助与教程</span>
                </nav>
              </div>
            </div>
          </div>
        </section>

        {/* 常见问题（FAQ）区 */}
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">常见问题</h2>
              <p className="text-lg text-text-secondary">快速找到您遇到的问题解决方案</p>
            </div>
            
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className={`${styles.faqItem} rounded-xl overflow-hidden`}>
                  <button 
                    onClick={() => handleFaqToggle(index)}
                    className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-lg font-semibold text-text-primary">{faq.question}</span>
                    <i 
                      className={`fas fa-chevron-down text-gray-400 transform transition-transform ${
                        expandedFaqIndex === index ? 'rotate-180' : 'rotate-0'
                      }`}
                    ></i>
                  </button>
                  <div className={`${styles.faqAnswer} ${expandedFaqIndex === index ? styles.expanded : ''} bg-gray-50 px-6`}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 视频教程区 */}
        <section className="py-16 px-8 bg-bg-secondary">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">视频教程</h2>
              <p className="text-lg text-text-secondary">观看详细教程，快速掌握使用技巧</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoTutorials.map((video) => (
                <div key={video.id} className={`${styles.videoCard} rounded-2xl overflow-hidden`}>
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <button 
                        onClick={() => handleVideoPlay(video.title)}
                        className="bg-white bg-opacity-90 text-gray-800 p-4 rounded-full hover:bg-opacity-100 transition-all"
                      >
                        <i className="fas fa-play text-xl"></i>
                      </button>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">{video.title}</h3>
                    <p className="text-text-secondary text-sm mb-4">{video.description}</p>
                    <div className="flex items-center justify-between text-sm text-text-secondary">
                      <span><i className="fas fa-eye mr-1"></i>{video.views}</span>
                      <span>{video.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 用户手册区 */}
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">用户手册</h2>
              <p className="text-lg text-text-secondary">详细的文字版操作指南，随时查阅</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* 完整用户手册 */}
              <div className={`${styles.featureCard} rounded-2xl p-8 text-center ${styles.cardHoverEffect}`}>
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-book text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">完整用户手册</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  包含所有功能的详细说明，从基础操作到高级技巧，适合系统学习。
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-file-pdf text-danger"></i>
                    <span className="text-sm text-text-secondary">PDF格式</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-download text-info"></i>
                    <span className="text-sm text-text-secondary">25.6 MB</span>
                  </div>
                </div>
                <button 
                  onClick={handleDownloadFullManual}
                  className={`${styles.btnGradient} text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center`}
                >
                  <i className="fas fa-download mr-2"></i>
                  下载完整手册
                </button>
              </div>
              
              {/* 快速入门指南 */}
              <div className={`${styles.featureCard} rounded-2xl p-8 text-center ${styles.cardHoverEffect}`}>
                <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-rocket text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">快速入门指南</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  精简版操作指南，快速掌握核心功能，适合初学者快速上手。
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-file-pdf text-danger"></i>
                    <span className="text-sm text-text-secondary">PDF格式</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <i className="fas fa-download text-info"></i>
                    <span className="text-sm text-text-secondary">8.2 MB</span>
                  </div>
                </div>
                <button 
                  onClick={handleDownloadQuickGuide}
                  className="bg-gradient-secondary text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center hover:shadow-lg transition-all"
                >
                  <i className="fas fa-download mr-2"></i>
                  下载快速指南
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 联系客服区 */}
        <section className="py-16 px-8 bg-bg-secondary">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">联系客服</h2>
              <p className="text-lg text-text-secondary">遇到问题？我们的客服团队随时为您提供帮助</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* 在线客服 */}
              <div className={`${styles.contactCard} rounded-2xl p-8 text-center`}>
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-comments text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">在线客服</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  实时在线咨询，工作日9:00-18:00为您提供及时帮助
                </p>
                <button 
                  onClick={handleOnlineChat}
                  className={`${styles.btnGradient} text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center`}
                >
                  <i className="fas fa-headset mr-2"></i>
                  立即咨询
                </button>
              </div>
              
              {/* 客服邮箱 */}
              <div className={`${styles.contactCard} rounded-2xl p-8 text-center`}>
                <div className="w-16 h-16 bg-gradient-tertiary rounded-xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-envelope text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">客服邮箱</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  发送邮件咨询，我们将在24小时内回复您的问题
                </p>
                <button 
                  onClick={handleEmailContact}
                  className="bg-gradient-tertiary text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center hover:shadow-lg transition-all"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  发送邮件
                </button>
              </div>
              
              {/* 客服电话 */}
              <div className={`${styles.contactCard} rounded-2xl p-8 text-center`}>
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-phone text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">客服电话</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  拨打客服热线，工作日9:00-18:00为您提供语音服务
                </p>
                <button 
                  onClick={handlePhoneContact}
                  className="bg-gradient-to-r from-warning to-orange-500 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center hover:shadow-lg transition-all"
                >
                  <i className="fas fa-phone mr-2"></i>
                  400-888-8888
                </button>
              </div>
            </div>
            
            {/* 反馈表单 */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-card">
              <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">问题反馈</h3>
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="feedback-name" className="block text-sm font-medium text-text-primary mb-2">姓名</label>
                    <input 
                      type="text" 
                      id="feedback-name" 
                      name="feedback-name" 
                      className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label htmlFor="feedback-email" className="block text-sm font-medium text-text-primary mb-2">邮箱</label>
                    <input 
                      type="email" 
                      id="feedback-email" 
                      name="feedback-email" 
                      className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="请输入您的邮箱地址"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="feedback-type" className="block text-sm font-medium text-text-primary mb-2">问题类型</label>
                  <select 
                    id="feedback-type" 
                    name="feedback-type" 
                    className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">请选择问题类型</option>
                    <option value="功能咨询">功能咨询</option>
                    <option value="技术支持">技术支持</option>
                    <option value="bug反馈">bug反馈</option>
                    <option value="建议意见">建议意见</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="feedback-content" className="block text-sm font-medium text-text-primary mb-2">问题描述</label>
                  <textarea 
                    id="feedback-content" 
                    name="feedback-content" 
                    rows={6}
                    className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none" 
                    placeholder="请详细描述您遇到的问题或建议..."
                  ></textarea>
                </div>
                <div className="text-center">
                  <button 
                    type="submit" 
                    className={`${styles.btnGradient} text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center`}
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    提交反馈
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HelpTutorialPage;

