

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface NotificationItem {
  id: number;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}

interface WorkItem {
  id: number;
  title: string;
  type: string;
  time: string;
  thumbnail: string;
}

const UserCenter: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userNickname, setUserNickname] = useState('创意达人');
  const [userPhone, setUserPhone] = useState('138****8888');
  const [originalNickname, setOriginalNickname] = useState('创意达人');
  const [originalPhone, setOriginalPhone] = useState('138****8888');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 通知数据
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: '新功能上线',
      content: '漫影叙新增AI绘画风格，现在支持更多艺术风格选择，快去体验吧！',
      time: '2小时前',
      isRead: false
    },
    {
      id: 2,
      title: '作品导出完成',
      content: '您的作品"仙侠传说分镜"已成功导出，可在作品管理中查看。',
      time: '1天前',
      isRead: true
    },
    {
      id: 3,
      title: '系统维护通知',
      content: '系统将于本周日凌晨2:00-4:00进行例行维护，期间可能影响使用。',
      time: '3天前',
      isRead: true
    }
  ]);

  // 作品数据
  const [recentWorks, setRecentWorks] = useState<WorkItem[]>([
    {
      id: 1,
      title: '仙侠传说分镜',
      type: '分镜作品',
      time: '2天前',
      thumbnail: 'https://s.coze.cn/image/eKHzlVyx5nQ/'
    },
    {
      id: 2,
      title: '星际征途视频',
      type: '视频作品',
      time: '1周前',
      thumbnail: 'https://s.coze.cn/image/nhFw7sOZ9eQ/'
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '个人中心 - 漫影叙';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // 移动端处理逻辑
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 事件处理函数
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = () => {
    setOriginalNickname(userNickname);
    setOriginalPhone(userPhone);
    setIsEditingProfile(false);
    alert('个人资料修改成功！');
  };

  const handleCancelProfile = () => {
    setUserNickname(originalNickname);
    setUserPhone(originalPhone);
    setIsEditingProfile(false);
  };

  const handleAvatarUpload = () => {
    console.log('需要调用第三方接口实现头像上传功能');
    alert('头像上传功能开发中...');
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('请填写完整信息');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }

    if (newPassword.length < 6) {
      alert('新密码长度至少6位');
      return;
    }

    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('密码修改成功！');
  };

  const handleChangeEmail = () => {
    alert('邮箱更换功能开发中...');
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
    alert('所有通知已标记为已读');
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isRead: true } : item
      )
    );
  };

  const handleViewMoreNotifications = () => {
    alert('查看更多通知功能开发中...');
  };

  const handleWorkClick = () => {
    navigate('/works-management');
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handlePasswordCancel();
    }
  };

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
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="https://s.coze.cn/image/62R8SA9jBr8/" 
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
              {!isSidebarCollapsed && <span className="text-gray-700">首页</span>}
            </Link>
            <Link to="/scene-generation" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-film text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">视频分镜生成</span>}
            </Link>
            <Link to="/video-generation" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-magic text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">图文转视频</span>}
            </Link>
            <Link to="/works-management" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-folder text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">作品管理</span>}
            </Link>
            <Link to="/asset-library" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-images text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">素材库</span>}
            </Link>
            <Link to="/user-center" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-user text-primary text-lg"></i>
              {!isSidebarCollapsed && <span className="text-primary font-medium">个人中心</span>}
            </Link>
            <Link to="/help-tutorial" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-question-circle text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">帮助教程</span>}
            </Link>
          </nav>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        {/* 页面头部 */}
        <div className="bg-white border-b border-border-light px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">个人中心</h1>
              <nav className="flex items-center space-x-2 text-sm text-text-secondary mt-1">
                <Link to="/home" className="hover:text-primary">首页</Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <span className="text-primary">个人中心</span>
              </nav>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* 个人资料管理区 */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-text-primary mb-6">个人资料</h2>
              <div className={`${styles.profileCard} rounded-2xl p-8 shadow-card`}>
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                  {/* 头像区域 */}
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img 
                        src="https://s.coze.cn/image/U7Dq3U9gSxM/" 
                        alt="用户头像" 
                        className="w-24 h-24 rounded-full border-4 border-gray-200"
                      />
                      <button 
                        onClick={handleAvatarUpload}
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-all"
                      >
                        <i className="fas fa-camera text-sm"></i>
                      </button>
                    </div>
                    <button 
                      onClick={handleAvatarUpload}
                      className="text-sm text-primary hover:underline"
                    >
                      更换头像
                    </button>
                  </div>
                  
                  {/* 个人信息表单 */}
                  <div className="flex-1 w-full">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="user-nickname" className="block text-sm font-medium text-text-primary">昵称</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            id="user-nickname" 
                            value={userNickname}
                            onChange={(e) => setUserNickname(e.target.value)}
                            readOnly={!isEditingProfile}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          {!isEditingProfile && (
                            <button 
                              onClick={handleEditProfile}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="user-email" className="block text-sm font-medium text-text-primary">邮箱</label>
                        <div className="relative">
                          <input 
                            type="email" 
                            id="user-email" 
                            value="creator@example.com" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                            readOnly
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">已验证</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="user-phone" className="block text-sm font-medium text-text-primary">手机号</label>
                        <div className="relative">
                          <input 
                            type="tel" 
                            id="user-phone" 
                            value={userPhone}
                            onChange={(e) => setUserPhone(e.target.value)}
                            readOnly={!isEditingProfile}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          {!isEditingProfile && (
                            <button 
                              onClick={handleEditProfile}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="user-join-date" className="block text-sm font-medium text-text-primary">加入时间</label>
                        <input 
                          type="text" 
                          id="user-join-date" 
                          value="2024年1月15日" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-text-secondary" 
                          readOnly
                        />
                      </div>
                    </div>
                    
                    {isEditingProfile && (
                      <div className="mt-6 flex space-x-4">
                        <button 
                          onClick={handleSaveProfile}
                          className={`${styles.btnGradient} text-white px-6 py-3 rounded-lg font-semibold`}
                        >
                          <i className="fas fa-save mr-2"></i>保存修改
                        </button>
                        <button 
                          onClick={handleCancelProfile}
                          className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                          <i className="fas fa-times mr-2"></i>取消
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 账号安全设置区 */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-text-primary mb-6">账号安全</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${styles.profileCard} rounded-2xl p-6 shadow-card`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-text-primary">修改密码</h3>
                      <p className="text-sm text-text-secondary">定期更换密码，保护账号安全</p>
                    </div>
                    <i className="fas fa-key text-primary text-xl"></i>
                  </div>
                  <button 
                    onClick={handleChangePassword}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>修改密码
                  </button>
                </div>
                
                <div className={`${styles.profileCard} rounded-2xl p-6 shadow-card`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-text-primary">绑定邮箱</h3>
                      <p className="text-sm text-text-secondary">creator@example.com</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-success text-sm">已绑定</span>
                      <i className="fas fa-envelope text-success text-xl"></i>
                    </div>
                  </div>
                  <button 
                    onClick={handleChangeEmail}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>更换邮箱
                  </button>
                </div>
              </div>
            </section>

            {/* 创作数据统计区 */}
            <section className="mb-12">
              <h2 className="text-xl font-semibold text-text-primary mb-6">创作数据</h2>
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className={`${styles.statsCard} rounded-2xl p-6 text-center shadow-card`}>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-film text-white text-xl"></i>
                  </div>
                  <div className="text-2xl font-bold text-text-primary mb-1">24</div>
                  <div className="text-sm text-text-secondary">总作品数</div>
                </div>
                
                <div className={`${styles.statsCard} rounded-2xl p-6 text-center shadow-card`}>
                  <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-clock text-white text-xl"></i>
                  </div>
                  <div className="text-2xl font-bold text-text-primary mb-1">156</div>
                  <div className="text-sm text-text-secondary">总时长(分钟)</div>
                </div>
                
                <div className={`${styles.statsCard} rounded-2xl p-6 text-center shadow-card`}>
                  <div className="w-12 h-12 bg-gradient-tertiary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-download text-white text-xl"></i>
                  </div>
                  <div className="text-2xl font-bold text-text-primary mb-1">89</div>
                  <div className="text-sm text-text-secondary">导出次数</div>
                </div>
                
                <div className={`${styles.statsCard} rounded-2xl p-6 text-center shadow-card`}>
                  <div className="w-12 h-12 bg-gradient-to-br from-warning to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-calendar text-white text-xl"></i>
                  </div>
                  <div className="text-2xl font-bold text-text-primary mb-1">45</div>
                  <div className="text-sm text-text-secondary">创作天数</div>
                </div>
              </div>
              
              {/* 最近创作 */}
              <div className={`${styles.profileCard} rounded-2xl p-6 shadow-card`}>
                <h3 className="text-lg font-medium text-text-primary mb-4">最近创作</h3>
                <div className="space-y-4">
                  {recentWorks.map((work) => (
                    <div key={work.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={work.thumbnail} 
                          alt="作品缩略图" 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-text-primary">{work.title}</h4>
                          <p className="text-sm text-text-secondary">{work.type} · {work.time}</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleWorkClick}
                        className="text-primary hover:text-primary-dark text-sm"
                      >
                        <i className="fas fa-external-link-alt mr-1"></i>查看
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 消息通知区 */}
            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-6">消息通知</h2>
              <div className={`${styles.profileCard} rounded-2xl shadow-card`}>
                {/* 通知头部 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-text-primary">系统通知</h3>
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-primary hover:text-primary-dark text-sm"
                  >
                    <i className="fas fa-check-double mr-1"></i>全部已读
                  </button>
                </div>
                
                {/* 通知列表 */}
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id)}
                      className={`${styles.notificationItem} p-6 hover:bg-gray-50 cursor-pointer`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.isRead ? 'bg-gray-300' : 'bg-primary'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-text-primary">{notification.title}</h4>
                            <span className="text-sm text-text-secondary">{notification.time}</span>
                          </div>
                          <p className="text-sm text-text-secondary">
                            {notification.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 查看更多 */}
                <div className="p-6 border-t border-gray-200 text-center">
                  <button 
                    onClick={handleViewMoreNotifications}
                    className="text-primary hover:text-primary-dark text-sm"
                  >
                    <i className="fas fa-arrow-down mr-1"></i>查看更多通知
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* 修改密码弹窗 */}
      {showPasswordModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={handleModalBackdropClick}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
              <h3 className="text-xl font-semibold text-text-primary mb-6">修改密码</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-text-primary mb-2">当前密码</label>
                  <input 
                    type="password" 
                    id="current-password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-text-primary mb-2">新密码</label>
                  <input 
                    type="password" 
                    id="new-password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary mb-2">确认新密码</label>
                  <input 
                    type="password" 
                    id="confirm-password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button 
                    type="button" 
                    onClick={handlePasswordCancel}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                  <button 
                    type="submit" 
                    className={`flex-1 ${styles.btnGradient} text-white py-3 rounded-lg font-medium`}
                  >
                    确认修改
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCenter;

