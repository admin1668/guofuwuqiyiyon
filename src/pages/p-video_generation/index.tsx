import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

interface VoiceOption {
  id: string;
  name: string;
  description: string;
}

interface MusicOption {
  id: string;
  name: string;
  description: string;
}

interface HistoryItem {
  id: string;
  name: string;
  timeAgo: string;
  resolution: string;
  duration: string;
  gradientClass: string;
}

interface GeneratedScene {
  id: number;
  title: string;
  description: string;
  image: string;
  duration: string;
  camera: string;
  prompt: string;
}

const VideoGenerationPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [textInputContent, setTextInputContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState('deep-male');
  const [selectedMusicId, setSelectedMusicId] = useState('warm-piano');
  const [durationSetting, setDurationSetting] = useState(3);
  const [speedSetting, setSpeedSetting] = useState(1);
  const [isExportSettingsExpanded, setIsExportSettingsExpanded] = useState(true);
  const [isImageUploadAreaDragover, setIsImageUploadAreaDragover] = useState(false);
  
  // 新增状态：AI生成功能
  const [loading, setLoading] = useState(false);
  const [generatedScenes, setGeneratedScenes] = useState<GeneratedScene[]>([]);
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  
  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '图文转视频 - 漫影叙';
    return () => { document.title = originalTitle; };
  }, []);
  
  // 语音选项数据
  const voiceOptions: VoiceOption[] = [
    { id: 'deep-male', name: '低沉男声', description: '稳重有力' },
    { id: 'gentle-female', name: '温柔女声', description: '甜美柔和' },
    { id: 'child', name: '儿童声', description: '天真活泼' }
  ];
  
  // 音乐选项数据
  const musicOptions: MusicOption[] = [
    { id: 'warm-piano', name: '温馨钢琴曲', description: '舒缓优美' },
    { id: 'upbeat-pop', name: '轻快流行乐', description: '活力四射' },
    { id: 'classical-orchestra', name: '古典交响乐', description: '庄重典雅' },
    { id: 'nature-sounds', name: '自然环境音', description: '宁静祥和' }
  ];
  
  // 历史项目数据
  const historyItems: HistoryItem[] = [
    {
      id: '1',
      name: '童话故事视频',
      timeAgo: '2天前',
      resolution: '1080p',
      duration: '3分钟',
      gradientClass: 'bg-gradient-primary'
    },
    {
      id: '2',
      name: '产品介绍视频',
      timeAgo: '1周前',
      resolution: '720p',
      duration: '2分钟',
      gradientClass: 'bg-gradient-secondary'
    },
    {
      id: '3',
      name: '教育课程视频',
      timeAgo: '2周前',
      resolution: '1080p',
      duration: '5分钟',
      gradientClass: 'bg-gradient-tertiary'
    }
  ];

  // 艺术风格选项 - 增强版
  const styleOptions = [
    { 
      id: 'realistic', 
      name: '写实风格', 
      description: '真实感强，细节丰富',
      color: 'from-blue-500 to-blue-700'
    },
    { 
      id: 'cartoon', 
      name: '卡通风格', 
      description: '色彩鲜艳，线条简洁',
      color: 'from-yellow-400 to-orange-500'
    },
    { 
      id: 'cinematic', 
      name: '电影风格', 
      description: '大片质感，光影强烈',
      color: 'from-purple-600 to-pink-600'
    },
    { 
      id: 'watercolor', 
      name: '水彩风格', 
      description: '柔和梦幻，色彩渐变',
      color: 'from-green-400 to-cyan-500'
    },
    { 
      id: 'anime', 
      name: '动漫风格', 
      description: '日系动漫，大眼睛',
      color: 'from-pink-400 to-rose-500'
    },
    { 
      id: 'cyberpunk', 
      name: '赛博朋克', 
      description: '未来科技，霓虹灯光',
      color: 'from-cyan-400 to-blue-600'
    }
  ];

  // 辅助函数：将文本分割为4个场景
  const splitTextForScenes = (text: string): string[] => {
    const words = text.split(/\s+/).filter(word => word.trim().length > 0);
    
    if (words.length === 0) {
      return ['开场内容', '发展内容', '高潮内容', '结尾内容'];
    }
    
    const segmentLength = Math.ceil(words.length / 4);
    const segments = [];
    
    for (let i = 0; i < 4; i++) {
      const start = i * segmentLength;
      const end = Math.min(start + segmentLength, words.length);
      const segment = words.slice(start, end).join(' ');
      segments.push(segment || `场景内容 ${i + 1}`);
    }
    
    return segments;
  };

  // 优化图片URL生成函数
  const generateDynamicImageUrl = (text: string, style: string, sceneType: string, index: number): string => {
    const baseSeed = encodeURIComponent(text.substring(0, 20) + style + sceneType + index);
    const timestamp = Date.now();
    return `https://picsum.photos/seed/${baseSeed}-${timestamp}/400/300`;
  };

  // 模拟AI生成视频场景 - 动态版
  const generateVideoScenes = async (text: string, style: string) => {
    // 模拟AI处理延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const styleInfo = styleOptions.find(s => s.id === style) || styleOptions[0];
    const textSegments = splitTextForScenes(text);
    
    // 场景配置
    const sceneConfigs = [
      { 
        id: 1, 
        title: '开场', 
        camera: '全景镜头',
        type: 'opening'
      },
      { 
        id: 2, 
        title: '发展', 
        camera: '中景镜头',
        type: 'development'
      },
      { 
        id: 3, 
        title: '高潮', 
        camera: '特写镜头',
        type: 'climax'
      },
      { 
        id: 4, 
        title: '结尾', 
        camera: '远景镜头',
        type: 'ending'
      }
    ];
    
    return sceneConfigs.map((config, index) => {
      const segmentText = textSegments[index];
      const previewText = segmentText.length > 15 
        ? `${segmentText.substring(0, 15)}...` 
        : segmentText;
      
      // 生成动态图片URL
      const imageUrl = generateDynamicImageUrl(text, style, config.type, index);
      
      return {
        id: config.id,
        title: `${styleInfo.name}${config.title}`,
        description: `"${previewText}"`,
        image: imageUrl,
        duration: `${durationSetting}秒`,
        camera: config.camera,
        prompt: `【${config.title}】${segmentText} | 风格:${styleInfo.name} | 镜头:${config.camera}`
      };
    });
  };

  // 图片错误处理函数
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, sceneId: number) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://picsum.photos/seed/fallback-${sceneId}-${Date.now()}/400/300`;
  };

  // 修改生成预览函数
  const handleGeneratePreview = async () => {
    if (!textInputContent.trim()) {
      alert('请先输入文本内容');
      return;
    }

    console.log('开始生成视频预览...');
    setLoading(true);
    setGeneratedScenes([]);
    
    try {
      // 调用AI生成场景
      const scenes = await generateVideoScenes(textInputContent, selectedStyle);
      setGeneratedScenes(scenes);
      
      // 模拟生成预览视频URL
      setPreviewVideoUrl('https://example.com/preview-video.mp4');
      
      console.log('生成完成:', scenes);
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 修改生成完整视频函数
  const handleGenerateVideo = async () => {
    if (!textInputContent.trim()) {
      alert('请先输入文本内容');
      return;
    }

    console.log('开始生成完整视频...');
    setLoading(true);
    
    try {
      // 调用AI生成场景
      const scenes = await generateVideoScenes(textInputContent, selectedStyle);
      setGeneratedScenes(scenes);
      
      // 这里可以添加完整的视频生成逻辑
      console.log('完整视频生成完成:', scenes);
      alert('完整视频生成成功！请查看下方生成的场景。');
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };
  
  // 事件处理函数
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInputContent(e.target.value);
  };
  
  const handleSplitText = () => {
    if (textInputContent.trim()) {
      const paragraphs = textInputContent.split(/[\n。！？；]/).filter(p => p.trim());
      if (paragraphs.length > 1) {
        alert(`已自动分为 ${paragraphs.length} 段`);
      } else {
        alert('文本内容过短，无法分段');
      }
    } else {
      alert('请先输入文本内容');
    }
  };
  
  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // 模拟上传成功
      const mockImage: UploadedImage = {
        id: Date.now().toString(),
        url: 'https://s.coze.cn/image/llT1b2md9rs/',
        name: files[0].name
      };
      setUploadedImages(prev => [...prev, mockImage]);
      
      // 清空input值，允许重复上传同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleImageUploadAreaDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsImageUploadAreaDragover(true);
  };
  
  const handleImageUploadAreaDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsImageUploadAreaDragover(false);
  };
  
  const handleImageUploadAreaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsImageUploadAreaDragover(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // 模拟上传成功
      const mockImage: UploadedImage = {
        id: Date.now().toString(),
        url: 'https://s.coze.cn/image/llT1b2md9rs/',
        name: files[0].name
      };
      setUploadedImages(prev => [...prev, mockImage]);
    }
  };
  
  const handleRemoveImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };
  
  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
  };
  
  const handleVoicePreview = (voiceId: string) => {
    console.log(`预览语音: ${voiceId}`);
    // 这里可以添加语音预览逻辑
    alert(`正在预览 ${voiceOptions.find(v => v.id === voiceId)?.name}...`);
  };
  
  const handleMusicSelect = (musicId: string) => {
    setSelectedMusicId(musicId);
  };
  
  const handleMusicPreview = (musicId: string) => {
    console.log(`预览音乐: ${musicId}`);
    // 这里可以添加音乐预览逻辑
    alert(`正在预览 ${musicOptions.find(m => m.id === musicId)?.name}...`);
  };
  
  const handleMusicStop = (musicId: string) => {
    console.log(`停止音乐: ${musicId}`);
    // 这里可以添加音乐停止逻辑
  };
  
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDurationSetting(parseInt(e.target.value));
  };
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeedSetting(parseFloat(e.target.value));
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };
  
  const getSpeedLabel = (speed: number): string => {
    const speedLabels: { [key: number]: string } = {
      0.5: '慢速',
      0.75: '稍慢',
      1: '正常',
      1.25: '稍快',
      1.5: '快速',
      2: '特快'
    };
    return speedLabels[speed] || `${speed}x`;
  };
  
  const handleExportSettingsToggle = () => {
    setIsExportSettingsExpanded(!isExportSettingsExpanded);
  };
  
  const handleSaveProject = () => {
    console.log('保存当前项目');
    const projectData = {
      text: textInputContent,
      scenes: generatedScenes,
      style: selectedStyle,
      voice: selectedVoiceId,
      music: selectedMusicId,
      duration: durationSetting
    };
    console.log('项目数据:', projectData);
    alert('项目已保存到本地存储');
  };
  
  const handleExportVideo = () => {
    if (generatedScenes.length === 0) {
      alert('请先生成视频内容');
      return;
    }
    
    console.log('导出视频');
    alert('视频导出成功！已跳转到作品管理页面。');
    navigate('/works-management');
  };
  
  const handleMoreMusic = () => {
    navigate('/asset-library?type=music');
  };
  
  const handleHistoryLoad = (projectName: string) => {
    console.log(`加载项目：${projectName}`);
    // 模拟加载历史项目
    setTextInputContent(`这是${projectName}的示例文本内容...`);
    setSelectedStyle('cinematic');
    alert(`正在加载项目：${projectName}`);
  };
  
  const handleCustomVoiceUpload = () => {
    console.log('需要调用第三方接口实现自定义语音上传功能');
    alert('自定义语音上传功能');
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
            <Link to="/video-generation" className="text-primary font-medium border-b-2 border-primary py-1">图文转视频</Link>
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
                src="https://s.coze.cn/image/JTT3zT2j17A/" 
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
            <Link 
              to="/home" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-home text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>首页</span>
            </Link>
            <Link 
              to="/scene-generation" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-film text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>视频分镜生成</span>
            </Link>
            <Link 
              to="/video-generation" 
              className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-magic text-primary text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-primary font-medium`}>图文转视频</span>
            </Link>
            <Link 
              to="/works-management" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-folder text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>作品管理</span>
            </Link>
            <Link 
              to="/asset-library" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-images text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>素材库</span>
            </Link>
            <Link 
              to="/user-center" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-user text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>个人中心</span>
            </Link>
            <Link 
              to="/help-tutorial" 
              className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}
            >
              <i className="fas fa-question-circle text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>帮助教程</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${
        isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded
      }`}>
        {/* 页面头部 */}
        <div className="bg-white border-b border-border-light px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">图文转视频</h1>
              <nav className="text-sm text-text-secondary mt-1">
                <Link to="/home" className="hover:text-primary">首页</Link>
                <span className="mx-2">/</span>
                <span>图文转视频</span>
              </nav>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSaveProject}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i className="fas fa-save mr-2"></i>保存
              </button>
              <button 
                onClick={handleExportVideo}
                className={`${styles.btnGradient} text-white px-6 py-2 rounded-lg font-semibold`}
              >
                <i className="fas fa-download mr-2"></i>导出视频
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="p-6 space-y-6">
          {/* 内容导入区 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              <i className="fas fa-upload text-primary mr-2"></i>内容导入
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* 文本输入 */}
              <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-text-primary mb-2">输入文本内容</label>
                <textarea 
                  id="text-input"
                  value={textInputContent}
                  onChange={handleTextInputChange}
                  className="w-full h-48 p-4 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="请输入或粘贴您的故事文本内容..."
                />
                <div className="flex items-center justify-between mt-2 text-sm text-text-secondary">
                  <span>{textInputContent.length} 字符</span>
                  <button 
                    onClick={handleSplitText}
                    className="text-primary hover:text-secondary transition-colors"
                  >
                    <i className="fas fa-magic mr-1"></i>智能分段
                  </button>
                </div>
              </div>
              
              {/* 图片上传 */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">上传图片素材</label>
                <div 
                  onClick={handleImageUploadClick}
                  onDragOver={handleImageUploadAreaDragOver}
                  onDragLeave={handleImageUploadAreaDragLeave}
                  onDrop={handleImageUploadAreaDrop}
                  className={`${styles.uploadArea} ${isImageUploadAreaDragover ? styles.uploadAreaDragover : ''} w-full h-48 rounded-lg flex flex-col items-center justify-center cursor-pointer`}
                >
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                  <p className="text-gray-600 text-center">
                    点击或拖拽图片到此处上传<br />
                    <span className="text-sm text-gray-400">支持 JPG、PNG 格式，最大 10MB</span>
                  </p>
                </div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/jpeg, image/png"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative">
                        <img 
                          src={image.url}
                          alt={image.name} 
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button 
                          onClick={() => handleRemoveImage(image.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full text-xs"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 艺术风格选择区 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              <i className="fas fa-palette text-primary mr-2"></i>选择艺术风格
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {styleOptions.map((style) => (
                <div 
                  key={style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  className={`${styles.styleOption} ${
                    selectedStyle === style.id ? styles.styleOptionSelected : ''
                  } border-2 ${
                    selectedStyle === style.id ? 'border-primary' : 'border-border-light'
                  } rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${style.color}`}></div>
                      <h4 className="font-semibold text-text-primary">{style.name}</h4>
                    </div>
                    {selectedStyle === style.id && (
                      <i className="fas fa-check text-primary text-lg"></i>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary pl-7">{style.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 视频预览区 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              <i className="fas fa-play-circle text-primary mr-2"></i>视频预览
            </h2>
            <div className={`${styles.videoPlayer} w-full max-w-4xl mx-auto`}>
              <video 
                className="w-full aspect-video" 
                controls 
                poster="https://s.coze.cn/image/RZgSDt-VzZA/"
                src={previewVideoUrl}
              >
                您的浏览器不支持视频播放。
              </video>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <button 
                onClick={handleGeneratePreview}
                disabled={loading}
                className={`${styles.btnGradient} text-white px-6 py-3 rounded-lg font-semibold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>生成中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play mr-2"></i>生成预览
                  </>
                )}
              </button>
              <button 
                onClick={handleGenerateVideo}
                disabled={loading}
                className="bg-gradient-secondary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>生成中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic mr-2"></i>生成视频
                  </>
                )}
              </button>
            </div>

            {/* 生成的场景展示 */}
            {generatedScenes.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-text-primary mb-6 border-b pb-2">
                  生成的视频场景 ({generatedScenes.length}个)
                  <span className="text-sm font-normal text-primary ml-2">
                    {styleOptions.find(s => s.id === selectedStyle)?.name}风格
                  </span>
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {generatedScenes.map((scene) => (
                    <div 
                      key={scene.id} 
                      className="border-2 border-border-light rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="relative group">
                        <img 
                          src={scene.image} 
                          alt={scene.title}
                          className="w-full h-40 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => handleImageError(e, scene.id)}
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {scene.duration}
                        </div>
                      </div>
                      <h4 className="font-bold text-text-primary text-sm mb-2">{scene.title}</h4>
                      <p className="text-xs text-text-secondary mb-3 line-clamp-2">{scene.description}</p>
                      <div className="flex justify-between text-xs text-text-secondary mb-3">
                        <span className="bg-gray-100 px-2 py-1 rounded">📷 {scene.camera}</span>
                      </div>
                      <div className="mt-2 text-xs text-primary bg-blue-50 p-2 rounded-lg border border-blue-100">
                        <strong className="text-blue-700">AI提示词:</strong> 
                        <div className="mt-1 text-gray-700">{scene.prompt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 参数调整区 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              <i className="fas fa-sliders-h text-primary mr-2"></i>参数调整
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* 画面时长 */}
              <div>
                <label htmlFor="duration-setting" className="block text-sm font-medium text-text-primary mb-2">画面时长</label>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-text-secondary">3秒</span>
                  <input 
                    type="range" 
                    id="duration-setting"
                    min="1" 
                    max="10" 
                    value={durationSetting}
                    onChange={handleDurationChange}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-text-secondary">10秒</span>
                </div>
                <span className="text-sm text-primary">当前：{durationSetting}秒</span>
              </div>
              
              {/* 转场效果 */}
              <div>
                <label htmlFor="transition-setting" className="block text-sm font-medium text-text-primary mb-2">转场效果</label>
                <select 
                  id="transition-setting"
                  className="w-full p-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="fade">淡入淡出</option>
                  <option value="slide">滑动</option>
                  <option value="zoom">缩放</option>
                  <option value="wipe">擦除</option>
                </select>
              </div>
              
              {/* 字幕设置 */}
              <div>
                <label htmlFor="subtitle-setting" className="block text-sm font-medium text-text-primary mb-2">字幕设置</label>
                <select 
                  id="subtitle-setting"
                  className="w-full p-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="auto">自动生成</option>
                  <option value="top">顶部显示</option>
                  <option value="bottom">底部显示</option>
                  <option value="none">不显示</option>
                </select>
              </div>
            </div>
          </div>

          {/* 配音设置区 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              <i className="fas fa-microphone text-primary mr-2"></i>AI配音
            </h2>
            
            {/* 语音选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-primary mb-3">选择AI语音</label>
              <div className="grid md:grid-cols-3 gap-3">
                {voiceOptions.map((voice) => (
                  <div 
                    key={voice.id}
                    onClick={() => handleVoiceSelect(voice.id)}
                    className={`${styles.voiceOption} ${selectedVoiceId === voice.id ? styles.voiceOptionSelected : ''} border border-border-light rounded-lg p-3 cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-text-primary">{voice.name}</h4>
                        <p className="text-sm text-text-secondary">{voice.description}</p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVoicePreview(voice.id);
                        }}
                        className="text-primary hover:text-secondary"
                      >
                        <i className="fas fa-play"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 语速和情感调节 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="speed-setting" className="block text-sm font-medium text-text-primary mb-2">语速调节</label>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-text-secondary">慢速</span>
                  <input 
                    type="range" 
                    id="speed-setting"
                    min="0.5" 
                    max="2" 
                    step="0.1" 
                    value={speedSetting}
                    onChange={handleSpeedChange}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-text-secondary">快速</span>
                </div>
                <span className="text-sm text-primary">当前：{getSpeedLabel(speedSetting)}</span>
              </div>
              
              <div>
                <label htmlFor="emotion-setting" className="block text-sm font-medium text-text-primary mb-2">情感调节</label>
                <select 
                  id="emotion-setting"
                  className="w-full p-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="neutral">中性</option>
                  <option value="happy">欢快</option>
                  <option value="sad">悲伤</option>
                  <option value="excited">兴奋</option>
                  <option value="calm">平静</option>
                </select>
              </div>
            </div>
            
            {/* 自定义语音上传 */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-text-primary mb-2">自定义语音上传</label>
              <div 
                onClick={handleCustomVoiceUpload}
                className={`${styles.uploadArea} w-full p-4 rounded-lg flex items-center justify-center cursor-pointer`}
              >
                <i className="fas fa-file-audio text-2xl text-gray-400 mr-3"></i>
                <span className="text-gray-600">点击上传自定义语音文件</span>
              </div>
            </div>
          </div>

          {/* 背景音乐选择区 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              <i className="fas fa-music text-primary mr-2"></i>背景音乐
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {musicOptions.map((music) => (
                <div 
                  key={music.id}
                  onClick={() => handleMusicSelect(music.id)}
                  className={`${styles.musicOption} ${selectedMusicId === music.id ? styles.musicOptionSelected : ''} border border-border-light rounded-lg p-3 cursor-pointer`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">{music.name}</h4>
                      <p className="text-sm text-text-secondary">{music.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMusicPreview(music.id);
                        }}
                        className="text-primary hover:text-secondary"
                      >
                        <i className="fas fa-play"></i>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMusicStop(music.id);
                        }}
                        className="text-danger hover:text-red-600"
                      >
                        <i className="fas fa-stop"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button 
                onClick={handleMoreMusic}
                className="text-primary hover:text-secondary transition-colors"
              >
                <i className="fas fa-plus mr-1"></i>查看更多音乐
              </button>
            </div>
          </div>

          {/* 导出设置区 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                <i className="fas fa-cog text-primary mr-2"></i>导出设置
              </h2>
              <button 
                onClick={handleExportSettingsToggle}
                className="text-text-secondary hover:text-primary transition-colors"
              >
                <i className={`fas ${isExportSettingsExpanded ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
              </button>
            </div>
            
            <div className={`${styles.collapsiblePanel} ${isExportSettingsExpanded ? styles.collapsiblePanelExpanded : styles.collapsiblePanelCollapsed} overflow-hidden`}>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="format-setting" className="block text-sm font-medium text-text-primary mb-2">导出格式</label>
                  <select 
                    id="format-setting"
                    className="w-full p-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="mp4">MP4</option>
                    <option value="mov">MOV</option>
                    <option value="avi">AVI</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="resolution-setting" className="block text-sm font-medium text-text-primary mb-2">分辨率</label>
                  <select 
                    id="resolution-setting"
                    className="w-full p-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="720p">720p (1280x720)</option>
                    <option value="1080p">1080p (1920x1080)</option>
                    <option value="4k">4K (3840x2160)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="quality-setting" className="block text-sm font-medium text-text-primary mb-2">视频质量</label>
                  <select 
                    id="quality-setting"
                    className="w-full p-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">低质量</option>
                    <option value="medium">中等质量</option>
                    <option value="high">高质量</option>
                    <option value="ultra">超高质量</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 历史记录区 */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              <i className="fas fa-history text-primary mr-2"></i>最近项目
            </h2>
            
            <div className="space-y-3">
              {historyItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-border-light rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-8 ${item.gradientClass} rounded flex items-center justify-center`}>
                      <i className="fas fa-video text-white text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{item.name}</h4>
                      <p className="text-sm text-text-secondary">{item.timeAgo} · {item.resolution} · {item.duration}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleHistoryLoad(item.name)}
                    className="text-primary hover:text-secondary transition-colors"
                  >
                    <i className="fas fa-download mr-1"></i>加载
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoGenerationPage;
