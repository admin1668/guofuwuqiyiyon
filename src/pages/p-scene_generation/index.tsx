import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface SceneFrame {
  id: number;
  imageUrl: string;
  description: string;
  prompt: string;
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
  const [frameCount, setFrameCount] = useState('4');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [progressText, setProgressText] = useState('正在分析文本内容...');
  const [sceneFrames, setSceneFrames] = useState<SceneFrame[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('png');
  
  const progressIntervalRef = useRef<number | null>(null);

  // 艺术风格选项
  const artStyles = [
    { id: 'anime', name: '日漫', color: 'from-pink-400 to-rose-500' },
    { id: 'chinese', name: '古风', color: 'from-yellow-400 to-orange-500' },
    { id: 'realistic', name: '写实', color: 'from-blue-500 to-blue-700' },
    { id: 'scifi', name: '科幻', color: 'from-purple-500 to-indigo-600' },
    { id: 'watercolor', name: '水彩', color: 'from-green-400 to-cyan-500' },
    { id: 'sketch', name: '素描', color: 'from-gray-400 to-gray-600' }
  ];

  // 模拟AI生成图像 - 使用更相关的图片服务
  const simulateAIImageGeneration = (text: string, style: string, frameIndex: number): string => {
    // 基于文本内容生成更相关的图片
    const keywords = extractKeywords(text);
    const baseKeyword = keywords[frameIndex % keywords.length] || 'story';
    
    const styleThemes = {
      anime: 'anime,illustration,cartoon',
      chinese: 'chinese,traditional,painting',
      realistic: 'realistic,photo,detailed',
      scifi: 'scifi,future,technology',
      watercolor: 'watercolor,painting,art',
      sketch: 'sketch,drawing,art'
    };
    
    const styleTheme = styleThemes[style as keyof typeof styleThemes] || 'art';
    
    // 使用不同的图片服务来获得更多样化的图片
    const services = [
      () => `https://picsum.photos/seed/${encodeURIComponent(text + style + frameIndex)}/512/512`,
      () => `https://source.unsplash.com/512x512/?${encodeURIComponent(baseKeyword)}`,
      () => `https://picsum.photos/512/512?random=${Date.now() + frameIndex}`
    ];
    
    const serviceIndex = frameIndex % services.length;
    return services[serviceIndex]();
  };

  // 从文本中提取关键词
  const extractKeywords = (text: string): string[] => {
    // 移除常见虚词
    const commonWords = ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'];
    
    // 提取有意义的词汇
    const words = text.split('').filter(char => 
      char.trim() && char.length === 1 && !commonWords.includes(char)
    );
    
    return [...new Set(words)].slice(0, 10);
  };

  // 生成AI提示词
  const generateAIPrompt = (text: string, style: string, frameIndex: number): string => {
    const styleNames = {
      anime: '日漫风格',
      chinese: '古风风格', 
      realistic: '写实风格',
      scifi: '科幻风格',
      watercolor: '水彩风格',
      sketch: '素描风格'
    };
    
    const sceneTypes = [
      '特写镜头',
      '中景画面', 
      '全景场景',
      '细节展示',
      '情节推进',
      '氛围营造'
    ];
    
    const styleName = styleNames[style as keyof typeof styleNames] || '写实风格';
    const sceneType = sceneTypes[frameIndex % sceneTypes.length];
    
    return `${styleName} - ${sceneType}：${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`;
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
    setSceneFrames([]);

    let currentStep = 0;
    const totalSteps = 5;
    
    progressIntervalRef.current = window.setInterval(() => {
      if (currentStep < totalSteps) {
        const progress = (currentStep + 1) * 20;
        setGenerationProgress(progress);
        
        const steps = [
          '正在分析文本内容...',
          '正在提取关键元素...',
          '正在构思画面构图...',
          '正在生成分镜画面...',
          '正在优化图像质量...'
        ];
        setProgressText(steps[currentStep]);
        currentStep++;
      } else {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        
        // 生成分镜
        generateSceneFrames();
        setIsGenerating(false);
      }
    }, 800);
  };

  // 生成分镜帧
  const generateSceneFrames = () => {
    const count = parseInt(frameCount);
    const newFrames: SceneFrame[] = [];
    
    // 将文本分割为多个部分
    const segments = splitTextForScenes(textInputValue, count);
    
    for (let i = 0; i < count; i++) {
      const segmentText = segments[i];
      const prompt = generateAIPrompt(segmentText, selectedArtStyle, i);
      const imageUrl = simulateAIImageGeneration(segmentText, selectedArtStyle, i);
      
      newFrames.push({
        id: i,
        imageUrl: imageUrl,
        description: `${artStyles.find(s => s.id === selectedArtStyle)?.name || '写实'}风格 - ${segmentText.substring(0, 15)}${segmentText.length > 15 ? '...' : ''}`,
        prompt: prompt
      });
    }
    
    setSceneFrames(newFrames);
  };

  // 将文本分割为场景
  const splitTextForScenes = (text: string, count: number): string[] => {
    const sentences = text.split(/[。！？.!?]/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) {
      return Array(count).fill('').map((_, i) => `场景内容 ${i + 1}`);
    }
    
    const segments = [];
    const sentencesPerSegment = Math.ceil(sentences.length / count);
    
    for (let i = 0; i < count; i++) {
      const start = i * sentencesPerSegment;
      const end = Math.min(start + sentencesPerSegment, sentences.length);
      const segment = sentences.slice(start, end).join('。');
      segments.push(segment || `分镜描述 ${i + 1}`);
    }
    
    return segments;
  };

  // 图片错误处理
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, frameId: number) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://picsum.photos/512/512?random=fallback-${frameId}`;
  };

  // 其他函数保持不变...
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInputValue(e.target.value);
  };

  const handleClearText = () => {
    setTextInputValue('');
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedArtStyle(styleId);
  };

  const handleSettingsToggle = () => {
    setIsSettingsExpanded(!isSettingsExpanded);
  };

  const handlePreviewScene = () => {
    if (sceneFrames.length === 0) {
      alert('请先生成分镜');
      return;
    }
    alert('分镜预览功能');
  };

  const handleSave = () => {
    const text = textInputValue.trim();
    if (!text) {
      alert('请先输入内容');
      return;
    }
    alert('作品已保存到作品管理');
  };

  const handleExport = () => {
    if (sceneFrames.length === 0) {
      alert('请先生成分镜');
      return;
    }
    setShowExportModal(true);
  };

  const handleConfirmExport = () => {
    alert(`分镜已导出为${exportFormat.toUpperCase()}格式`);
    setShowExportModal(false);
    setTimeout(() => {
      navigate('/works-management');
    }, 500);
  };

  // 拖拽功能
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, frameId: number) => {
    e.dataTransfer.setData('frameId', frameId.toString());
    const target = e.target as HTMLElement;
    target.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    target.classList.remove('dragging');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSidebarToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <i className="fas fa-bars text-gray-600"></i>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-video text-white text-lg"></i>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">漫影叙</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="text-gray-600 hover:text-blue-600 py-1 transition-colors">首页</Link>
            <Link to="/scene-generation" className="text-blue-600 font-medium border-b-2 border-blue-600 py-1">视频分镜生成</Link>
            <Link to="/video-generation" className="text-gray-600 hover:text-blue-600 py-1 transition-colors">图文转视频</Link>
            <Link to="/asset-library" className="text-gray-600 hover:text-blue-600 py-1 transition-colors">素材库</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="https://s.coze.cn/image/0GA8ad_DIUE/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full border-2 border-gray-200"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">创作者</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="pt-16 min-h-screen">
        {/* 页面头部 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">视频分镜生成</h1>
              <nav className="text-sm text-gray-500 mt-1">
                <Link to="/home" className="hover:text-blue-600">首页</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-700">视频分镜生成</span>
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
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <i className="fas fa-download mr-2"></i>导出分镜
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="p-6 space-y-6">
          {/* 文本输入区 */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-edit text-blue-500 mr-2"></i>输入文本内容
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                  请输入小说段落或描述性文本：
                </label>
                <textarea 
                  id="text-input"
                  value={textInputValue}
                  onChange={handleTextInputChange}
                  className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="例如：月光如水，洒在古老的石板街上。一位身着白衣的少女缓缓走来，她的长发在夜风中轻轻飘动..."
                />
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>{textInputValue.length} 字</span>
                  <button 
                    onClick={handleClearText}
                    className="text-red-500 hover:underline"
                  >
                    清空
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 风格选择区 */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-palette text-blue-500 mr-2"></i>选择艺术风格
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {artStyles.map((style) => (
                <div 
                  key={style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${
                    selectedArtStyle === style.id 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-r ${style.color} flex items-center justify-center`}>
                    <i className="fas fa-paint-brush text-white"></i>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{style.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 生成设置区 */}
          <section className="bg-white rounded-2xl shadow-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-cog text-blue-500 mr-2"></i>生成设置
              </h2>
              <button 
                onClick={handleSettingsToggle}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className={`fas fa-chevron-down transition-transform ${isSettingsExpanded ? 'rotate-180' : ''}`}></i>
              </button>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isSettingsExpanded ? 'max-h-96' : 'max-h-0'}`}>
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="frame-count" className="block text-sm font-medium text-gray-700 mb-2">分镜数量</label>
                  <select 
                    id="frame-count"
                    value={frameCount}
                    onChange={(e) => setFrameCount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2">2 帧</option>
                    <option value="4">4 帧</option>
                    <option value="6">6 帧</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">建议选择2-4个分镜以获得最佳效果</p>
                </div>
              </div>
            </div>
          </section>

          {/* 操作按钮区 */}
          <section className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGenerateScene}
                disabled={isGenerating}
                className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>AI生成中...
                  </>
                ) : (
                  <>
                    <i className="fas fa-robot mr-2"></i>AI生成分镜
                  </>
                )}
              </button>
              <button 
                onClick={handlePreviewScene}
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all"
              >
                <i className="fas fa-eye mr-2"></i>预览分镜
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              ⚡ 智能模拟AI图像生成，根据文本内容创作相关分镜画面
            </p>
          </section>

          {/* 生成进度区 */}
          {isGenerating && (
            <section className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-robot text-blue-500 mr-2"></i>AI正在生成分镜...
              </h2>
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <span className="text-gray-600">{progressText}</span>
                </div>
              </div>
            </section>
          )}

          {/* 分镜预览区 */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-images text-blue-500 mr-2"></i>AI生成分镜
              </h2>
              {sceneFrames.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">拖拽调整顺序</span>
                  <i className="fas fa-arrows-alt text-gray-400"></i>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sceneFrames.length === 0 ? (
                <div className="bg-gray-100 rounded-xl p-8 text-center border-2 border-dashed border-gray-300 col-span-2">
                  <i className="fas fa-robot text-4xl text-gray-400 mb-4"></i>
                  <p className="text-lg text-gray-500 mb-2">等待AI生成分镜</p>
                  <p className="text-sm text-gray-400">输入文本内容并选择艺术风格，点击"AI生成分镜"开始创作</p>
                </div>
              ) : (
                sceneFrames.map((frame, index) => (
                  <div 
                    key={frame.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, frame.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, frame.id)}
                    className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 cursor-move hover:shadow-xl transition-all"
                  >
                    <div className="relative">
                      <img 
                        src={frame.imageUrl}
                        alt={`分镜画面 ${index + 1}`}
                        className="w-full h-64 object-cover"
                        onError={(e) => handleImageError(e, frame.id)}
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                        {index + 1}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2">{frame.description}</p>
                      <div className="bg-blue-50 rounded-lg p-2 mt-2">
                        <p className="text-xs text-blue-700">
                          <strong>AI提示词:</strong> {frame.prompt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* 导出设置弹窗 */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">导出分镜</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="export-format" className="block text-sm font-medium text-gray-700 mb-2">导出格式</label>
                <select 
                  id="export-format"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
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
