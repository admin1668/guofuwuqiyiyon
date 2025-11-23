

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface AssetItem {
  id: string;
  type: 'image' | 'music' | 'voice';
  title: string;
  description: string;
  category: string;
  isFavorited: boolean;
  uploadTime: string;
  imageUrl?: string;
}

const AssetLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isGridView, setIsGridView] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<AssetItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // 模拟素材数据
  const [assets, setAssets] = useState<AssetItem[]>([
    {
      id: 'asset-1',
      type: 'image',
      title: '古风仙侠人物',
      description: '仙侠风格插画',
      category: '人物',
      isFavorited: false,
      uploadTime: '2天前',
      imageUrl: 'https://s.coze.cn/image/p_cNwwQTp8k/'
    },
    {
      id: 'asset-2',
      type: 'music',
      title: '古风背景音乐',
      description: '古典乐器演奏',
      category: '',
      isFavorited: true,
      uploadTime: '1周前'
    },
    {
      id: 'asset-3',
      type: 'image',
      title: '未来城市',
      description: '科幻风格建筑',
      category: '建筑城市',
      isFavorited: false,
      uploadTime: '3天前',
      imageUrl: 'https://s.coze.cn/image/HLwlOU5nMgQ/'
    },
    {
      id: 'asset-4',
      type: 'voice',
      title: '自然环境音效',
      description: '风声雨声鸟鸣',
      category: '',
      isFavorited: false,
      uploadTime: '5天前'
    },
    {
      id: 'asset-5',
      type: 'image',
      title: '都市夜景',
      description: '现代城市风光',
      category: '建筑城市',
      isFavorited: false,
      uploadTime: '1天前',
      imageUrl: 'https://s.coze.cn/image/8dNn3BQ5RpA/'
    },
    {
      id: 'asset-6',
      type: 'music',
      title: '科幻电子音乐',
      description: '未来感电子音效',
      category: '',
      isFavorited: false,
      uploadTime: '6天前'
    },
    {
      id: 'asset-7',
      type: 'image',
      title: '森林风光',
      description: '自然生态景观',
      category: '自然风景',
      isFavorited: true,
      uploadTime: '4天前',
      imageUrl: 'https://s.coze.cn/image/kEQv2nvv7Og/'
    },
    {
      id: 'asset-8',
      type: 'voice',
      title: '机械科技音效',
      description: '机器人机械音',
      category: '',
      isFavorited: false,
      uploadTime: '1周前'
    },
    {
      id: 'asset-9',
      type: 'image',
      title: '星空宇宙',
      description: '浩瀚星空场景',
      category: '自然风景',
      isFavorited: false,
      uploadTime: '2天前',
      imageUrl: 'https://s.coze.cn/image/Q1v5LeSAkYU/'
    },
    {
      id: 'asset-10',
      type: 'music',
      title: '轻松背景音乐',
      description: '温馨治愈风格',
      category: '',
      isFavorited: false,
      uploadTime: '3天前'
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '素材库 - 漫影叙';
    return () => { document.title = originalTitle; };
  }, []);

  // 筛选素材
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || asset.type === typeFilter;
    const matchesCategory = !categoryFilter || asset.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  // 处理侧边栏切换
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // 处理资产选择
  const handleAssetSelect = (assetId: string, event: React.MouseEvent) => {
    // 如果点击的是按钮，不触发选择
    if ((event.target as HTMLElement).closest('button')) return;
    
    const newSelectedAssets = new Set(selectedAssets);
    if (newSelectedAssets.has(assetId)) {
      newSelectedAssets.delete(assetId);
    } else {
      newSelectedAssets.add(assetId);
    }
    setSelectedAssets(newSelectedAssets);
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    if (selectedAssets.size > 0 && window.confirm(`确定要删除选中的 ${selectedAssets.size} 个素材吗？`)) {
      setAssets(prevAssets => prevAssets.filter(asset => !selectedAssets.has(asset.id)));
      setSelectedAssets(new Set());
    }
  };

  // 处理批量收藏
  const handleBatchFavorite = () => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        selectedAssets.has(asset.id) 
          ? { ...asset, isFavorited: !asset.isFavorited }
          : asset
      )
    );
  };

  // 处理收藏切换
  const handleFavoriteToggle = (assetId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId ? { ...asset, isFavorited: !asset.isFavorited } : asset
      )
    );
  };

  // 处理预览
  const handlePreview = (asset: AssetItem, event: React.MouseEvent) => {
    event.stopPropagation();
    setPreviewAsset(asset);
    setShowPreviewModal(true);
  };

  // 处理使用素材
  const handleUseAsset = (asset: AssetItem, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/scene-generation?assetId=${asset.id}&assetType=${asset.type}`);
  };

  // 处理上传
  const handleUpload = () => {
    setShowUploadModal(true);
  };

  // 处理文件选择
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  // 处理拖拽上传
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.add(styles.dragover);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove(styles.dragover);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove(styles.dragover);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // 处理文件上传
  const handleFileUpload = (files: FileList) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setShowUploadModal(false);
            alert('文件上传成功！');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  // 渲染资产卡片
  const renderAssetCard = (asset: AssetItem) => {
    const isSelected = selectedAssets.has(asset.id);
    
    return (
      <div
        key={asset.id}
        className={`${styles.assetCard} ${isGridView ? '' : styles.assetCardList} ${isSelected ? styles.selected : ''} rounded-xl overflow-hidden cursor-pointer`}
        onClick={(e) => handleAssetSelect(asset.id, e)}
      >
        <div className="relative">
          {asset.type === 'image' ? (
            <img 
              src={asset.imageUrl} 
              alt={asset.title} 
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className={`w-full h-40 ${asset.type === 'music' ? 'bg-gradient-secondary' : 'bg-gradient-tertiary'} flex items-center justify-center`}>
              <i className={`fas fa-${asset.type === 'music' ? 'music' : 'volume-up'} text-white text-4xl`}></i>
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <button 
              className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
              onClick={(e) => handleFavoriteToggle(asset.id, e)}
            >
              <i className={`fas fa-heart ${asset.isFavorited ? 'text-danger' : 'text-gray-400 hover:text-danger'}`}></i>
            </button>
          </div>
          
          <div className="absolute bottom-2 left-2">
            <span className={`${asset.type === 'image' ? 'bg-primary' : asset.type === 'music' ? 'bg-secondary' : 'bg-tertiary'} text-white px-2 py-1 rounded-full text-xs`}>
              {asset.type === 'image' ? '图片' : asset.type === 'music' ? '音乐' : '音效'}
            </span>
          </div>
          
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <button 
              className="bg-white bg-opacity-90 text-gray-800 p-3 rounded-full"
              onClick={(e) => handlePreview(asset, e)}
            >
              <i className={`fas fa-${asset.type === 'image' ? 'eye' : 'play'}`}></i>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-text-primary mb-1 truncate">{asset.title}</h3>
          <p className="text-sm text-text-secondary mb-2">{asset.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">{asset.uploadTime}</span>
            <div className="flex items-center space-x-2">
              <button 
                className="text-primary text-xs hover:underline"
                onClick={(e) => handleUseAsset(asset, e)}
              >
                使用
              </button>
              <button className="text-text-secondary text-xs hover:text-primary">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16">
        <div className="flex items-center justify-between h-full px-6">
          {/* 左侧：Logo和产品名称 */}
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={handleSidebarToggle}
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
            <Link to="/asset-library" className="text-primary font-medium border-b-2 border-primary py-1">素材库</Link>
          </nav>
          
          {/* 右侧：用户操作区 */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-danger rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="https://s.coze.cn/image/FYP0Pps4eDs/" 
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
      <aside className={`fixed left-0 top-16 bottom-0 bg-white shadow-lg z-40 ${isSidebarCollapsed ? styles.sidebarCollapsed : styles.sidebarExpanded} transition-all duration-300`}>
        <div className="p-4">
          <nav className="space-y-2">
            <Link to="/home" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-home text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>首页</span>
            </Link>
            <Link to="/scene-generation" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-film text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>视频分镜生成</span>
            </Link>
            <Link to="/video-generation" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-magic text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>图文转视频</span>
            </Link>
            <Link to="/works-management" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-folder text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>作品管理</span>
            </Link>
            <Link to="/asset-library" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-images text-primary text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-primary font-medium`}>素材库</span>
            </Link>
            <Link to="/user-center" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-user text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>个人中心</span>
            </Link>
            <Link to="/help-tutorial" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-question-circle text-gray-600 text-lg"></i>
              <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} text-gray-700`}>帮助教程</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className={`${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded} pt-16 min-h-screen transition-all duration-300`}>
        {/* 页面头部 */}
        <section className="bg-white border-b border-border-light px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">素材库</h1>
              <nav className="flex items-center space-x-2 text-sm text-text-secondary mt-1">
                <Link to="/home" className="hover:text-primary">首页</Link>
                <i className="fas fa-chevron-right text-xs"></i>
                <span>素材库</span>
              </nav>
            </div>
            
            {/* 搜索和筛选 */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="搜索素材..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
              </div>
              
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">全部类型</option>
                <option value="image">图片</option>
                <option value="music">音乐</option>
                <option value="voice">音效</option>
              </select>
              
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">全部分类</option>
                <option value="人物">人物</option>
                <option value="自然风景">自然风景</option>
                <option value="建筑城市">建筑城市</option>
                <option value="动物">动物</option>
                <option value="运动体育">运动体育</option>
                <option value="交通工具">交通工具</option>
                <option value="食物">食物</option>
                <option value="服饰时尚">服饰时尚</option>
                <option value="商业科技">商业科技</option>
                <option value="游戏娱乐">游戏娱乐</option>
                <option value="艺术">艺术</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>
        </section>

        {/* 工具栏区域 */}
        <section className="bg-white border-b border-border-light px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button 
                className={`${styles.btnGradient} text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2`}
                onClick={handleUpload}
              >
                <i className="fas fa-upload"></i>
                <span>上传素材</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button 
                  className="px-4 py-2 bg-danger text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedAssets.size === 0}
                  onClick={handleBatchDelete}
                >
                  <i className="fas fa-trash mr-1"></i>
                  批量删除
                </button>
                <button 
                  className="px-4 py-2 bg-warning text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={selectedAssets.size === 0}
                  onClick={handleBatchFavorite}
                >
                  <i className="fas fa-star mr-1"></i>
                  批量收藏
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">共 <span>{filteredAssets.length}</span> 个素材</span>
              
              <div className="flex items-center space-x-2">
                <button 
                  className={`p-2 ${isGridView ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} rounded-lg`}
                  onClick={() => setIsGridView(true)}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button 
                  className={`p-2 ${!isGridView ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} rounded-lg`}
                  onClick={() => setIsGridView(false)}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 素材展示区域 */}
        <section className="p-8">
          <div className={isGridView ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "space-y-4"}>
            {filteredAssets.map(asset => renderAssetCard(asset))}
          </div>
        </section>

        {/* 分页区域 */}
        <section className="bg-white border-t border-border-light px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">每页显示</span>
              <select className="px-3 py-1 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="10">10</option>
                <option value="20" selected>20</option>
                <option value="50">50</option>
              </select>
              <span className="text-sm text-text-secondary">条，共 {filteredAssets.length} 条记录</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-border-light rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="px-3 py-1 bg-primary text-white rounded-lg">1</button>
              <button className="px-3 py-1 border border-border-light rounded-lg hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-border-light rounded-lg hover:bg-gray-50">3</button>
              <span className="px-2 text-text-secondary">...</span>
              <button className="px-3 py-1 border border-border-light rounded-lg hover:bg-gray-50">8</button>
              <button className="px-3 py-1 border border-border-light rounded-lg hover:bg-gray-50">
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 上传素材模态框 */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={() => setShowUploadModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
              <div className="p-6 border-b border-border-light">
                <h2 className="text-xl font-bold text-text-primary">上传素材</h2>
                <button 
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowUploadModal(false)}
                >
                  <i className="fas fa-times text-gray-500"></i>
                </button>
              </div>
              
              <div className="p-6">
                <div 
                  className={`${styles.uploadArea} rounded-xl p-8 text-center cursor-pointer`}
                  onClick={() => document.getElementById('file-input')?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <i className="fas fa-cloud-upload-alt text-4xl text-text-secondary mb-4"></i>
                  <p className="text-lg font-medium text-text-primary mb-2">拖拽文件到此处或点击上传</p>
                  <p className="text-sm text-text-secondary mb-6">支持图片、音乐、音效文件，单个文件不超过10MB</p>
                  <button 
                    className={`${styles.btnGradient} text-white px-6 py-3 rounded-lg font-medium`}
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('file-input')?.click();
                    }}
                  >
                    选择文件
                  </button>
                  <input 
                    type="file" 
                    id="file-input" 
                    className="hidden" 
                    multiple 
                    accept="image/*,audio/*"
                    onChange={handleFileSelect}
                  />
                </div>
                
                {isUploading && (
                  <div className="mt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-primary">上传中...</span>
                        <span className="text-sm text-text-secondary">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 预览模态框 */}
      {showPreviewModal && previewAsset && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={() => setShowPreviewModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
              <div className="p-6 border-b border-border-light">
                <h2 className="text-xl font-bold text-text-primary">{previewAsset.title}</h2>
                <button 
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-lg"
                  onClick={() => setShowPreviewModal(false)}
                >
                  <i className="fas fa-times text-gray-500"></i>
                </button>
              </div>
              
              <div className="p-6">
                <div className="text-center">
                  {previewAsset.type === 'image' ? (
                    <img 
                      src={previewAsset.imageUrl} 
                      alt={previewAsset.title} 
                      className="max-w-full max-h-96 mx-auto rounded-lg"
                    />
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
                      <i className={`fas fa-${previewAsset.type === 'music' ? 'music' : 'volume-up'} text-6xl text-text-secondary mb-4`}></i>
                      <div className="flex items-center justify-center space-x-4">
                        <button className="p-3 bg-primary text-white rounded-full hover:bg-opacity-90">
                          <i className="fas fa-play"></i>
                        </button>
                        <button className="p-3 bg-gray-300 text-gray-600 rounded-full hover:bg-gray-400">
                          <i className="fas fa-pause"></i>
                        </button>
                      </div>
                      <div className="mt-4 bg-gray-300 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-1/3"></div>
                      </div>
                      <p className="text-sm text-text-secondary mt-2">0:15 / 2:30</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-center space-x-4">
                  <button 
                    className={`${styles.btnGradient} text-white px-6 py-3 rounded-lg font-medium`}
                    onClick={() => {
                      setShowPreviewModal(false);
                      navigate('/scene-generation');
                    }}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    添加到项目
                  </button>
                  <button 
                    className="px-6 py-3 border border-border-light rounded-lg font-medium hover:bg-gray-50"
                    onClick={() => alert('下载功能')}
                  >
                    <i className="fas fa-download mr-2"></i>
                    下载
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetLibraryPage;

