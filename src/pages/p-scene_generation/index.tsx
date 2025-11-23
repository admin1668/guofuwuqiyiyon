

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface SceneFrame {
  id: number;
  imageUrl: string;
  description: string;
}

interface ProgressStep {
  value: number;
  text: string;
}

const SceneGenerationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [selectedArtStyle, setSelectedArtStyle] = useState('anime');
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [frameCount, setFrameCount] = useState('6');
  const [resolution, setResolution] = useState('720p');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [progressText, setProgressText] = useState('正在分析文本内容...');
  const [sceneFrames, setSceneFrames] = useState<SceneFrame[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  
  const progressIntervalRef = useRef<number | null>(null);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '视频分镜生成 - 漫影叙';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // 艺术风格选项
  const artStyles = [
    { id: 'anime', name: '日漫', imageUrl: 'https://s.coze.cn/image/Edn4X_2_9KE/' },
    { id: 'chinese', name: '古风', imageUrl: 'https://s.coze.cn/image/vIsLuD9QTzs/' },
    { id: 'realistic', name: '写实', imageUrl: 'https://s.coze.cn/image/0-p7scrE--w/' },
    { id: 'scifi', name: '科幻', imageUrl: 'https://s.coze.cn/image/aMJr72y7NUU/' },
    { id: 'watercolor', name: '水彩', imageUrl: 'https://s.coze.cn/image/-86uSxZJklk/' },
    { id: 'sketch', name: '素描', imageUrl: 'https://s.coze.cn/image/oPvnJVlJocQ/' }
  ];

  // 生成进度步骤
  const progressSteps: ProgressStep[] = [
    { value: 20, text: '正在分析文本内容...' },
    { value: 40, text: '正在提取关键元素...' },
    { value: 60, text: '正在生成画面构图...' },
    { value: 80, text: '正在渲染分镜画面...' },
    { value: 100, text: '生成完成！' }
  ];

  // 示例分镜图片
  const sampleImages = [
    'https://s.coze.cn/image/15A_Eo27QlE/',
    'https://s.coze.cn/image/wOCuJaVgyvU/',
    'https://s.coze.cn/image/5B1-VBaFyY8/',
    'https://s.coze.cn/image/3HrMMAmaiYI/',
    'https://s.coze.cn/image/bmIRdN-y-e0/',
    'https://s.coze.cn/image/U0L60H4TqPU/'
  ];

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // 处理文本输入
  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInputValue(e.target.value);
  };

  // 清空文本
  const handleClearText = () => {
    setTextInputValue('');
  };

  // 选择艺术风格
  const handleStyleSelect = (styleId: string) => {
    setSelectedArtStyle(styleId);
  };

  // 切换设置展开状态
  const handleSettingsToggle = () => {
    setIsSettingsExpanded(!isSettingsExpanded);
  };

  // 生成分镜
  const handleGenerateScene = () => {
    const text = textInputValue.trim();
    if (!text) {
      alert('请先输入文本内容');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setProgressText('正在分析文本内容...');

    let currentStep = 0;
    progressIntervalRef.current = window.setInterval(() => {
      if (currentStep < progressSteps.length) {
        setGenerationProgress(progressSteps[currentStep].value);
        setProgressText(progressSteps[currentStep].text);
        currentStep++;
      } else {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setTimeout(() => {
          setIsGenerating(false);
          generateSceneFrames();
        }, 500);
      }
    }, 800);
  };

  // 生成示例分镜帧
  const generateSceneFrames = () => {
    const newFrames: SceneFrame[] = [];
    const count = parseInt(frameCount);
    
    for (let i = 0; i < count; i++) {
      newFrames.push({
        id: i,
        imageUrl: sampleImages[i % sampleImages.length],
        description: `分镜画面 ${i + 1}`
      });
    }
    
    setSceneFrames(newFrames);
  };

  // 预览分镜
  const handlePreviewScene = () => {
    if (sceneFrames.length === 0) {
      alert('请先生成分镜');
      return;
    }
    alert('分镜预览功能');
  };

  // 保存作品
  const handleSave = () => {
    const text = textInputValue.trim();
    if (!text) {
      alert('请先输入内容');
      return;
    }
    alert('作品已保存到作品管理');
  };

  // 导出分镜
  const handleExport = () => {
    if (sceneFrames.length === 0) {
      alert('请先生成分镜');
      return;
    }
    setShowExportModal(true);
  };

  // 确认导出
  const handleConfirmExport = () => {
    alert(`分镜已导出为${exportFormat.toUpperCase()}格式`);
    setShowExportModal(false);
    setTimeout(() => {
      navigate('/works-management');
    }, 500);
  };

  // 分镜编辑功能
  const handleEditDetail = () => {
    alert('分镜细节修改功能');
  };

  const handleReplaceElement = () => {
    navigate('/asset-library');
  };

  const handleChangeStyle = () => {
    alert('分镜风格调整功能');
  };

  const handleDeleteFrame = () => {
    if (sceneFrames.length > 0) {
      if (confirm('确定要删除选中的分镜吗？')) {
        const newFrames = sceneFrames.slice(0, -1);
        setSceneFrames(newFrames);
      }
    }
  };

  // 拖拽功能
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, frameId: number) => {
    e.dataTransfer.setData('frameId', frameId.toString());
    const target = e.target as HTMLElement;
    target.classList.add(styles.dragging);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    target.classList.remove(styles.dragging);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (!target.classList.contains(styles.dragging)) {
      target.style.borderColor = '#667eea';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    target.style.borderColor = '#e2e8f0';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetFrameId: number) => {
    e.preventDefault();
    const draggedFrameId = parseInt(e.dataTransfer.getData('frameId'));
    
    if (draggedFrameId !== targetFrameId) {
      const newFrames = [...sceneFrames];
      const draggedIndex = newFrames.findIndex(frame => frame.id === draggedFrameId);
      const targetIndex = newFrames.findIndex(frame => frame.id === targetFrameId);
      
      [newFrames[draggedIndex], newFrames[targetIndex]] = [newFrames[targetIndex], newFrames[draggedIndex]];
      setSceneFrames(newFrames);
    }
    
    const target = e.target as HTMLElement;
    target.style.borderColor = '#e2e8f0';
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
            <Link to="/scene-generation" className="text-primary font-medium border-b-2 border-primary py-1">视频分镜生成</Link>
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
                src="https://s.coze.cn/image/0GA8ad_DIUE/" 
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
      <aside className={`fixed left-0 top-16 bottom-0 bg-white shadow-lg z-40 transition-all duration-300 ${sidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded}`}>
        <div className="p-4">
          <nav className="space-y-2">
            <Link to="/home" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-home text-gray-600 text-lg"></i>
              {!sidebarCollapsed && <span className="text-gray-700">首页</span>}
            </Link>
            <Link to="/scene-generation" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-film text-primary text-lg"></i>
              {!sidebarCollapsed && <span className="text-primary font-medium">视频分镜生成</span>}
            </Link>
            <Link to="/video-generation" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-magic text-gray-600 text-lg"></i>
              {!sidebarCollapsed && <span className="text-gray-700">图文转视频</span>}
            </Link>
            <Link to="/works-management" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-folder text-gray-600 text-lg"></i>
              {!sidebarCollapsed && <span className="text-gray-700">作品管理</span>}
            </Link>
            <Link to="/asset-library" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-images text-gray-600 text-lg"></i>
              {!sidebarCollapsed && <span className="text-gray-700">素材库</span>}
            </Link>
            <Link to="/user-center" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-user text-gray-600 text-lg"></i>
              {!sidebarCollapsed && <span className="text-gray-700">个人中心</span>}
            </Link>
            <Link to="/help-tutorial" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-question-circle text-gray-600 text-lg"></i>
              {!sidebarCollapsed && <span className="text-gray-700">帮助教程</span>}
            </Link>
          </nav>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded}`}>
        {/* 页面头部 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">视频分镜生成</h1>
              <nav className="text-sm text-text-secondary mt-1">
                <Link to="/home" className="hover:text-primary">首页</Link>
                <span className="mx-2">/</span>
                <span className="text-text-primary">视频分镜生成</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <i className="fas fa-save mr-2"></i>保存
              </button>
              <button 
                onClick={handleExport}
                className={`px-4 py-2 ${styles.btnGradient} text-white rounded-lg`}
              >
                <i className="fas fa-download mr-2"></i>导出分镜
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="p-6 space-y-6">
          {/* 文本输入区 */}
          <section className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              <i className="fas fa-edit text-primary mr-2"></i>输入文本内容
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-text-secondary mb-2">
                  请输入小说段落或描述性文本：
                </label>
                <textarea 
                  id="text-input"
                  value={textInputValue}
                  onChange={handleTextInputChange}
                  className={`w-full h-48 p-4 border border-gray-300 rounded-lg ${styles.formInputFocus} resize-none`}
                  placeholder="例如：月光如水，洒在古老的石板街上。一位身着白衣的少女缓缓走来，她的长发在夜风中轻轻飘动..."
                />
                <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
                  <span>{textInputValue.length} 字</span>
                  <button 
                    onClick={handleClearText}
                    className="text-danger hover:underline"
                  >
                    清空
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 风格选择区 */}
          <section className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              <i className="fas fa-palette text-primary mr-2"></i>选择艺术风格
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {artStyles.map((style) => (
                <div 
                  key={style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  className={`${styles.styleCard} ${selectedArtStyle === style.id ? styles.selected : ''} border-2 border-gray-200 rounded-xl p-3 text-center`}
                >
                  <img 
                    src={style.imageUrl}
                    alt={`${style.name}风格`}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <span className="text-sm font-medium text-text-primary">{style.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 生成设置区 */}
          <section className="bg-white rounded-2xl shadow-card">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-text-primary">
                <i className="fas fa-cog text-primary mr-2"></i>生成设置
              </h2>
              <button 
                onClick={handleSettingsToggle}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className={`fas fa-chevron-down transition-transform ${isSettingsExpanded ? 'rotate-180' : ''}`}></i>
              </button>
            </div>
            <div className={`${styles.collapsibleContent} ${isSettingsExpanded ? styles.expanded : ''}`}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="frame-count" className="block text-sm font-medium text-text-secondary mb-2">分镜数量</label>
                    <select 
                      id="frame-count"
                      value={frameCount}
                      onChange={(e) => setFrameCount(e.target.value)}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                    >
                      <option value="4">4 帧</option>
                      <option value="6">6 帧</option>
                      <option value="8">8 帧</option>
                      <option value="10">10 帧</option>
                      <option value="12">12 帧</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="resolution" className="block text-sm font-medium text-text-secondary mb-2">分辨率</label>
                    <select 
                      id="resolution"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                    >
                      <option value="1080p">1920x1080 (1080p)</option>
                      <option value="720p">1280x720 (720p)</option>
                      <option value="480p">854x480 (480p)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="aspect-ratio" className="block text-sm font-medium text-text-secondary mb-2">宽高比</label>
                    <select 
                      id="aspect-ratio"
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className={`w-full p-3 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                    >
                      <option value="16:9">16:9 (宽屏)</option>
                      <option value="4:3">4:3 (标准)</option>
                      <option value="1:1">1:1 (正方形)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 操作按钮区 */}
          <section className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGenerateScene}
                className={`${styles.btnGradient} text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg`}
              >
                <i className="fas fa-magic mr-2"></i>生成分镜
              </button>
              <button 
                onClick={handlePreviewScene}
                className="bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all"
              >
                <i className="fas fa-eye mr-2"></i>预览分镜
              </button>
            </div>
          </section>

          {/* 生成进度区 */}
          {isGenerating && (
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                <i className="fas fa-spinner fa-spin text-primary mr-2"></i>正在生成分镜...
              </h2>
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${styles.progressBar} h-3 rounded-full`}
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <span className="text-text-secondary">{progressText}</span>
                </div>
              </div>
            </section>
          )}

          {/* 分镜预览区 */}
          <section className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                <i className="fas fa-images text-primary mr-2"></i>分镜预览
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">拖拽调整顺序</span>
                <i className="fas fa-arrows-alt text-gray-400"></i>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sceneFrames.length === 0 ? (
                <div className="bg-gray-100 rounded-xl p-4 text-center border-2 border-dashed border-gray-300">
                  <i className="fas fa-plus text-4xl text-gray-400 mb-2"></i>
                  <p className="text-sm text-text-secondary">点击生成分镜</p>
                </div>
              ) : (
                sceneFrames.map((frame, index) => (
                  <div 
                    key={frame.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, frame.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, frame.id)}
                    className={`${styles.sceneFrame} bg-white rounded-xl overflow-hidden shadow-card border-2 border-gray-200 cursor-move`}
                  >
                    <div className="relative">
                      <img 
                        src={frame.imageUrl}
                        alt={`分镜画面 ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                        {index + 1}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-text-secondary">{frame.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 分镜编辑工具栏 */}
          {sceneFrames.length > 0 && (
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                <i className="fas fa-tools text-primary mr-2"></i>分镜编辑
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button 
                  onClick={handleEditDetail}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-center"
                >
                  <i className="fas fa-edit text-2xl text-primary mb-2"></i>
                  <div className="text-sm font-medium">细节修改</div>
                </button>
                <button 
                  onClick={handleReplaceElement}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-center"
                >
                  <i className="fas fa-exchange-alt text-2xl text-primary mb-2"></i>
                  <div className="text-sm font-medium">元素替换</div>
                </button>
                <button 
                  onClick={handleChangeStyle}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-center"
                >
                  <i className="fas fa-palette text-2xl text-primary mb-2"></i>
                  <div className="text-sm font-medium">风格调整</div>
                </button>
                <button 
                  onClick={handleDeleteFrame}
                  className="p-4 border border-gray-200 rounded-lg hover:border-danger hover:shadow-lg transition-all text-center"
                >
                  <i className="fas fa-trash text-2xl text-danger mb-2"></i>
                  <div className="text-sm font-medium">删除分镜</div>
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* 导出设置弹窗 */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-text-primary mb-4">导出分镜</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="export-format" className="block text-sm font-medium text-text-secondary mb-2">导出格式</label>
                <select 
                  id="export-format"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className={`w-full p-3 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                >
                  <option value="png">PNG 图片序列</option>
                  <option value="jpg">JPG 图片序列</option>
                  <option value="pdf">PDF 故事板</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleConfirmExport}
                  className={`flex-1 py-3 ${styles.btnGradient} text-white rounded-lg`}
                >
                  确认导出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SceneGenerationPage;

