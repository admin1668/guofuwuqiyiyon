

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const HomePage: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '漫影叙 - AI视频创作工具';
    return () => { document.title = originalTitle; };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleStartCreate = () => {
    navigate('/scene-generation');
  };

  const handleWatchDemo = () => {
    console.log('需要调用第三方接口实现视频播放功能');
    alert('演示视频即将播放...');
  };

  const handleNotifications = () => {
    console.log('需要调用第三方接口实现通知功能');
    alert('通知功能');
  };

  const handleUserMenu = () => {
    navigate('/login-register');
  };

  const handleWorkClick = () => {
    console.log('需要调用第三方接口实现作品预览功能');
    alert('作品预览功能');
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
            <Link to="/home" className="text-primary font-medium border-b-2 border-primary py-1">首页</Link>
            <Link to="/scene-generation" className="text-text-secondary hover:text-primary py-1 transition-colors">视频分镜生成</Link>
            <Link to="/video-generation" className="text-text-secondary hover:text-primary py-1 transition-colors">图文转视频</Link>
            <Link to="/asset-library" className="text-text-secondary hover:text-primary py-1 transition-colors">素材库</Link>
          </nav>
          
          {/* 右侧：用户操作区 */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleNotifications}
              className="p-2 rounded-lg hover:bg-gray-100 relative"
            >
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            <div 
              onClick={handleUserMenu}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <img 
                src="https://s.coze.cn/image/LrftzkEH0X0/" 
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
      <aside className={`fixed left-0 top-16 bottom-0 bg-white shadow-lg z-40 transition-all duration-300 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
        <div className="p-4">
          <nav className="space-y-2">
            <Link 
              to="/home" 
              className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-home text-primary text-lg"></i>
              {!isSidebarCollapsed && <span className="text-primary font-medium">首页</span>}
            </Link>
            <Link 
              to="/scene-generation" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-film text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">视频分镜生成</span>}
            </Link>
            <Link 
              to="/video-generation" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-magic text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">图文转视频</span>}
            </Link>
            <Link 
              to="/works-management" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-folder text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">作品管理</span>}
            </Link>
            <Link 
              to="/asset-library" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-images text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">素材库</span>}
            </Link>
            <Link 
              to="/user-center" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-user text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">个人中心</span>}
            </Link>
            <Link 
              to="/help-tutorial" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-question-circle text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">帮助教程</span>}
            </Link>
          </nav>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded}`}>
        {/* 页面头部 */}
        <section className={`${styles.heroGradient} text-white py-20 px-8`}>
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">AI赋能，让创意触手可及</h1>
            <p className="text-xl mb-8 opacity-90">漫影叙 - 专业的AI视频创作工具，轻松将文字转化为生动视频</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleStartCreate}
                className={`${styles.btnGradient} text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg`}
              >
                <i className="fas fa-play mr-2"></i>
                开始创作
              </button>
              <button 
                onClick={handleWatchDemo}
                className="bg-white bg-opacity-20 text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white border-opacity-30 hover:bg-opacity-30 transition-all"
              >
                <i className="fas fa-play-circle mr-2"></i>
                观看演示
              </button>
            </div>
          </div>
        </section>

        {/* 功能介绍区 */}
        <section className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">核心功能</h2>
              <p className="text-lg text-text-secondary">两大核心功能，满足您的创作需求</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* 视频分镜生成 */}
              <Link 
                to="/scene-generation"
                className={`${styles.featureCard} ${styles.cardHoverEffect} rounded-2xl p-8 transition-all duration-300 cursor-pointer block`}
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-film text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">视频分镜生成</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  输入小说段落或描述性文本，AI自动解析内容，生成符合场景、人物、动作的分镜画面。支持多种艺术风格，让您的创意快速可视化。
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-success"></i>
                    <span className="text-sm text-text-secondary">20+ 种预设画风</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-success"></i>
                    <span className="text-sm text-text-secondary">多段落同时生成</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-success"></i>
                    <span className="text-sm text-text-secondary">分镜顺序调整</span>
                  </div>
                </div>
                <div className={`${styles.btnGradient} text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center`}>
                  立即体验
                  <i className="fas fa-arrow-right ml-2"></i>
                </div>
              </Link>
              
              {/* 图文转视频 */}
              <Link 
                to="/video-generation"
                className={`${styles.featureCard} ${styles.cardHoverEffect} rounded-2xl p-8 transition-all duration-300 cursor-pointer block`}
              >
                <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mb-6">
                  <i className="fas fa-magic text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">图文转视频</h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  将文字内容自动转换为完整视频，包含AI配音、背景音乐、字幕等元素。支持多语言配音和情感调节，让您的作品更具感染力。
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-success"></i>
                    <span className="text-sm text-text-secondary">2000+ AI语音选择</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-success"></i>
                    <span className="text-sm text-text-secondary">自动生成字幕</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-success"></i>
                    <span className="text-sm text-text-secondary">丰富背景音乐</span>
                  </div>
                </div>
                <div className="bg-gradient-secondary text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center hover:shadow-lg transition-all">
                  立即体验
                  <i className="fas fa-arrow-right ml-2"></i>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 推荐作品展示区 */}
        <section className="py-16 px-8 bg-bg-secondary">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">精彩作品</h2>
              <p className="text-lg text-text-secondary">看看其他创作者用漫影叙制作的精彩内容</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* 作品1 */}
              <div 
                onClick={handleWorkClick}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src="https://s.coze.cn/image/yF-dheL6Js0/" 
                    alt="古风小说分镜作品" 
                    className="w-full h-48 object-cover" 
                    data-category="艺术"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-white bg-opacity-90 text-gray-800 p-3 rounded-full">
                      <i className="fas fa-play"></i>
                    </button>
                  </div>
                  <span className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm">分镜作品</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">仙侠传说</h3>
                  <p className="text-text-secondary text-sm mb-4">古风仙侠小说改编，精美的人物设计和场景描绘</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://s.coze.cn/image/qfpW7yt5g70/" 
                        alt="作者头像" 
                        className="w-6 h-6 rounded-full" 
                        data-category="人物"
                      />
                      <span className="text-sm text-text-secondary">仙侠迷</span>
                    </div>
                    <span className="text-sm text-text-secondary">2天前</span>
                  </div>
                </div>
              </div>
              
              {/* 作品2 */}
              <div 
                onClick={handleWorkClick}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src="https://s.coze.cn/image/CPA4_ROfUBo/" 
                    alt="科幻故事视频作品" 
                    className="w-full h-48 object-cover" 
                    data-category="艺术"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-white bg-opacity-90 text-gray-800 p-3 rounded-full">
                      <i className="fas fa-play"></i>
                    </button>
                  </div>
                  <span className="absolute top-3 left-3 bg-secondary text-white px-3 py-1 rounded-full text-sm">视频作品</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">星际征途</h3>
                  <p className="text-text-secondary text-sm mb-4">科幻小说改编，AI配音让故事更加生动</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://s.coze.cn/image/HHVsFjR1WVw/" 
                        alt="作者头像" 
                        className="w-6 h-6 rounded-full" 
                        data-category="人物"
                      />
                      <span className="text-sm text-text-secondary">科幻作家</span>
                    </div>
                    <span className="text-sm text-text-secondary">1周前</span>
                  </div>
                </div>
              </div>
              
              {/* 作品3 */}
              <div 
                onClick={handleWorkClick}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img 
                    src="https://s.coze.cn/image/VPRU3TwPui4/" 
                    alt="都市情感分镜作品" 
                    className="w-full h-48 object-cover" 
                    data-category="艺术"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button className="bg-white bg-opacity-90 text-gray-800 p-3 rounded-full">
                      <i className="fas fa-play"></i>
                    </button>
                  </div>
                  <span className="absolute top-3 left-3 bg-tertiary text-white px-3 py-1 rounded-full text-sm">分镜作品</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">都市情缘</h3>
                  <p className="text-text-secondary text-sm mb-4">现代都市情感故事，细腻的人物情感表达</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://s.coze.cn/image/kHFTxBW0qUE/" 
                        alt="作者头像" 
                        className="w-6 h-6 rounded-full" 
                        data-category="人物"
                      />
                      <span className="text-sm text-text-secondary">情感写手</span>
                    </div>
                    <span className="text-sm text-text-secondary">3天前</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link 
                to="/works-management" 
                className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
              >
                查看更多作品
              </Link>
            </div>
          </div>
        </section>

        {/* 快速入口区 */}
        <section className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-text-primary mb-4">快速开始</h2>
              <p className="text-lg text-text-secondary">选择您的创作方式，立即开始创作之旅</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {/* 快速入口1 */}
              <Link 
                to="/scene-generation"
                className="text-center p-6 rounded-2xl bg-gradient-card border border-border-light hover:border-primary hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-pen-fancy text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">文字生成分镜</h3>
                <p className="text-sm text-text-secondary mb-4">输入小说段落，AI自动生成分镜</p>
                <span className="text-primary font-medium text-sm hover:underline">开始创作 →</span>
              </Link>
              
              {/* 快速入口2 */}
              <Link 
                to="/video-generation"
                className="text-center p-6 rounded-2xl bg-gradient-card border border-border-light hover:border-secondary hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-video text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">图文转视频</h3>
                <p className="text-sm text-text-secondary mb-4">文字图片一键转换为完整视频</p>
                <span className="text-secondary font-medium text-sm hover:underline">开始创作 →</span>
              </Link>
              
              {/* 快速入口3 */}
              <Link 
                to="/asset-library"
                className="text-center p-6 rounded-2xl bg-gradient-card border border-border-light hover:border-tertiary hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-tertiary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-layer-group text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">模板库</h3>
                <p className="text-sm text-text-secondary mb-4">使用预设模板快速创作</p>
                <span className="text-tertiary font-medium text-sm hover:underline">浏览模板 →</span>
              </Link>
              
              {/* 快速入口4 */}
              <Link 
                to="/help-tutorial"
                className="text-center p-6 rounded-2xl bg-gradient-card border border-border-light hover:border-warning hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-graduation-cap text-white text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">学习教程</h3>
                <p className="text-sm text-text-secondary mb-4">观看教程快速上手</p>
                <span className="text-warning font-medium text-sm hover:underline">观看教程 →</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;

