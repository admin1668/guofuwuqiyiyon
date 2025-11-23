

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface Work {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  created: string;
  status: string;
  duration: string;
  scenes: number;
}

const WorksManagementPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 模拟作品数据
  const [mockWorks] = useState<Work[]>([
    {
      id: 'work_001',
      name: '仙侠传说分镜',
      type: '分镜',
      thumbnail: 'https://s.coze.cn/image/JoxdTtvn1yA/',
      created: '2024-01-15 14:30',
      status: '已完成',
      duration: '5分钟',
      scenes: 12
    },
    {
      id: 'work_002',
      name: '星际征途视频',
      type: '视频',
      thumbnail: 'https://s.coze.cn/image/SXytUTqQ1tI/',
      created: '2024-01-14 09:15',
      status: '已完成',
      duration: '3分钟',
      scenes: 8
    },
    {
      id: 'work_003',
      name: '都市情缘分镜',
      type: '分镜',
      thumbnail: 'https://s.coze.cn/image/kfFA3sMG12g/',
      created: '2024-01-13 16:45',
      status: '草稿',
      duration: '2分钟',
      scenes: 6
    },
    {
      id: 'work_004',
      name: '魔法学院故事',
      type: '视频',
      thumbnail: 'https://s.coze.cn/image/sgK3axThlBc/',
      created: '2024-01-12 11:20',
      status: '处理中',
      duration: '4分钟',
      scenes: 10
    },
    {
      id: 'work_005',
      name: '未来都市分镜',
      type: '分镜',
      thumbnail: 'https://s.coze.cn/image/io9oSLfbv-Y/',
      created: '2024-01-11 13:50',
      status: '已完成',
      duration: '6分钟',
      scenes: 15
    },
    {
      id: 'work_006',
      name: '古风言情视频',
      type: '视频',
      thumbnail: 'https://s.coze.cn/image/iyXdlvLxZ4g/',
      created: '2024-01-10 10:15',
      status: '已完成',
      duration: '3分钟',
      scenes: 7
    },
    {
      id: 'work_007',
      name: '科幻战争分镜',
      type: '分镜',
      thumbnail: 'https://s.coze.cn/image/pbzn1jOhR30/',
      created: '2024-01-09 15:30',
      status: '草稿',
      duration: '8分钟',
      scenes: 20
    },
    {
      id: 'work_008',
      name: '青春校园视频',
      type: '视频',
      thumbnail: 'https://s.coze.cn/image/A8aPO4z38Po/',
      created: '2024-01-08 12:45',
      status: '已完成',
      duration: '2分钟',
      scenes: 5
    },
    {
      id: 'work_009',
      name: '悬疑推理分镜',
      type: '分镜',
      thumbnail: 'https://s.coze.cn/image/Rlby1z267aY/',
      created: '2024-01-07 17:20',
      status: '处理中',
      duration: '4分钟',
      scenes: 9
    },
    {
      id: 'work_010',
      name: '神话传说视频',
      type: '视频',
      thumbnail: 'https://s.coze.cn/image/OiYN0RI_SOo/',
      created: '2024-01-06 09:30',
      status: '已完成',
      duration: '5分钟',
      scenes: 11
    }
  ]);

  // 状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filteredWorks, setFilteredWorks] = useState<Work[]>([...mockWorks]);
  const [selectedWorks, setSelectedWorks] = useState<Set<string>>(new Set());
  const [currentSort, setCurrentSort] = useState('created_desc');
  const [currentRenameWorkId, setCurrentRenameWorkId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [previewWorkData, setPreviewWorkData] = useState<Work | null>(null);
  const [shareWorkId, setShareWorkId] = useState<string>('');
  const [newWorkName, setNewWorkName] = useState('');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '作品管理 - 漫影叙';
    return () => { document.title = originalTitle; };
  }, []);

  // 筛选和排序作品
  useEffect(() => {
    let filtered = mockWorks.filter(work => {
      const matchesSearch = work.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = !typeFilter || work.type === typeFilter;
      const matchesStatus = !statusFilter || work.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });

    // 排序
    filtered.sort((a, b) => {
      switch (currentSort) {
        case 'created_asc':
          return new Date(a.created).getTime() - new Date(b.created).getTime();
        case 'created_desc':
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setFilteredWorks(filtered);
    setCurrentPage(1); // 重置到第一页
  }, [searchTerm, typeFilter, statusFilter, currentSort, mockWorks]);

  // 计算分页信息
  const totalItems = filteredWorks.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentWorks = filteredWorks.slice(startIndex, endIndex);
  const startItem = totalItems > 0 ? startIndex + 1 : 0;
  const endItem = Math.min(endIndex, totalItems);

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedWorks(new Set(currentWorks.map(work => work.id)));
    } else {
      setSelectedWorks(new Set());
    }
  };

  // 处理单个选择
  const handleSelectWork = (workId: string, checked: boolean) => {
    const newSelected = new Set(selectedWorks);
    if (checked) {
      newSelected.add(workId);
    } else {
      newSelected.delete(workId);
    }
    setSelectedWorks(newSelected);
  };

  // 检查是否全选
  const isAllSelected = currentWorks.length > 0 && selectedWorks.size === currentWorks.length;
  const isIndeterminate = selectedWorks.size > 0 && selectedWorks.size < currentWorks.length;

  // 生成页码
  const generatePageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 防抖函数
  const debounce = (func: Function, wait: number) => {
    let timeout: number;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // 处理搜索
  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  // 预览作品
  const handlePreviewWork = (workId: string) => {
    const work = mockWorks.find(w => w.id === workId);
    if (work) {
      setPreviewWorkData(work);
      setShowPreviewModal(true);
    }
  };

  // 编辑作品
  const handleEditWork = (workId: string, workType: string) => {
    if (workType === '分镜') {
      navigate(`/scene-generation?workId=${workId}`);
    } else {
      navigate(`/video-generation?workId=${workId}`);
    }
  };

  // 导出作品
  const handleExportWork = (workId: string) => {
    console.log('导出作品:', workId);
    alert('作品导出中...');
  };

  // 分享作品
  const handleShareWork = (workId: string) => {
    setShareWorkId(workId);
    setShowShareModal(true);
  };

  // 复制分享链接
  const handleCopyShareLink = () => {
    const shareLink = `https://manyingxu.com/share/${shareWorkId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      // 复制成功的反馈
      console.log('链接已复制');
    }).catch(err => {
      console.error('复制失败:', err);
    });
  };

  // 重命名作品
  const handleRenameWork = (workId: string, currentName: string) => {
    setCurrentRenameWorkId(workId);
    setNewWorkName(currentName);
    setShowRenameModal(true);
  };

  // 确认重命名
  const handleConfirmRename = () => {
    if (newWorkName.trim() && currentRenameWorkId) {
      // 在实际应用中，这里会调用API更新作品名称
      console.log('重命名作品:', currentRenameWorkId, '为:', newWorkName);
      setShowRenameModal(false);
      setCurrentRenameWorkId(null);
      setNewWorkName('');
    }
  };

  // 删除作品
  const handleDeleteWork = (workId: string) => {
    if (confirm('确定要删除这个作品吗？此操作不可撤销。')) {
      console.log('删除作品:', workId);
      setSelectedWorks(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(workId);
        return newSelected;
      });
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedWorks.size > 0 && confirm(`确定要删除选中的 ${selectedWorks.size} 个作品吗？此操作不可撤销。`)) {
      console.log('批量删除作品:', Array.from(selectedWorks));
      setSelectedWorks(new Set());
    }
  };

  // 批量导出
  const handleBatchExport = () => {
    console.log('批量导出作品:', Array.from(selectedWorks));
    alert(`正在批量导出 ${selectedWorks.size} 个作品...`);
  };

  // 获取状态徽章样式
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case '已完成':
        return styles.statusBadgeCompleted;
      case '草稿':
        return styles.statusBadgeDraft;
      case '处理中':
        return styles.statusBadgeProcessing;
      default:
        return '';
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
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
                src="https://s.coze.cn/image/VG7Z5NDnJ3c/" 
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
            <Link to="/works-management" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-folder text-primary text-lg"></i>
              {!isSidebarCollapsed && <span className="text-primary font-medium">作品管理</span>}
            </Link>
            <Link to="/asset-library" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-images text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">素材库</span>}
            </Link>
            <Link to="/user-center" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-user text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">个人中心</span>}
            </Link>
            <Link to="/help-tutorial" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`}>
              <i className="fas fa-question-circle text-gray-600 text-lg"></i>
              {!isSidebarCollapsed && <span className="text-gray-700">帮助教程</span>}
            </Link>
          </nav>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className={`${isSidebarCollapsed ? styles.mainContentCollapsed : styles.mainContentExpanded} pt-16 min-h-screen transition-all duration-300`}>
        <div className="p-6">
          {/* 页面头部 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">作品管理</h1>
                <nav className="text-sm text-text-secondary mt-1">
                  <Link to="/home" className="hover:text-primary">首页</Link>
                  <span className="mx-2">/</span>
                  <span className="text-text-primary">作品管理</span>
                </nav>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleBatchDelete}
                  disabled={selectedWorks.size === 0}
                  className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-trash mr-2"></i>批量删除
                </button>
                <button 
                  onClick={handleBatchExport}
                  disabled={selectedWorks.size === 0}
                  className="px-4 py-2 bg-info text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-download mr-2"></i>批量导出
                </button>
              </div>
            </div>
            
            {/* 搜索和筛选 */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="搜索作品名称..." 
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-80 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">全部类型</option>
                  <option value="分镜">分镜作品</option>
                  <option value="视频">视频作品</option>
                </select>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">全部状态</option>
                  <option value="草稿">草稿</option>
                  <option value="已完成">已完成</option>
                  <option value="处理中">处理中</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                  >
                    <i className="fas fa-list"></i>
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                  >
                    <i className="fas fa-th"></i>
                  </button>
                </div>
                <select 
                  value={currentSort}
                  onChange={(e) => setCurrentSort(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="created_desc">创建时间 ↓</option>
                  <option value="created_asc">创建时间 ↑</option>
                  <option value="name_asc">名称 A-Z</option>
                  <option value="name_desc">名称 Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* 作品列表 */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = isIndeterminate;
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作品名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      创建时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentWorks.map(work => (
                    <tr key={work.id} className={styles.tableRow}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          value={work.id}
                          checked={selectedWorks.has(work.id)}
                          onChange={(e) => handleSelectWork(work.id, e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div 
                          className="flex items-center space-x-3 cursor-pointer hover:text-primary"
                          onClick={() => handlePreviewWork(work.id)}
                        >
                          <img 
                            src={work.thumbnail} 
                            alt={work.name} 
                            className="w-12 h-8 rounded object-cover"
                          />
                          <span className="font-medium text-gray-900">{work.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          work.type === '分镜' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {work.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {work.created}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(work.status)}`}>
                          {work.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handlePreviewWork(work.id)}
                            className={`text-primary hover:text-blue-700 text-sm ${styles.actionButton}`}
                            title="预览"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            onClick={() => handleEditWork(work.id, work.type)}
                            className={`text-secondary hover:text-purple-700 text-sm ${styles.actionButton}`}
                            title="编辑"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => handleExportWork(work.id)}
                            className={`text-success hover:text-green-700 text-sm ${styles.actionButton}`}
                            title="导出"
                          >
                            <i className="fas fa-download"></i>
                          </button>
                          <button 
                            onClick={() => handleShareWork(work.id)}
                            className={`text-info hover:text-blue-700 text-sm ${styles.actionButton}`}
                            title="分享"
                          >
                            <i className="fas fa-share"></i>
                          </button>
                          <button 
                            onClick={() => handleRenameWork(work.id, work.name)}
                            className={`text-warning hover:text-yellow-700 text-sm ${styles.actionButton}`}
                            title="重命名"
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteWork(work.id)}
                            className={`text-danger hover:text-red-700 text-sm ${styles.actionButton}`}
                            title="删除"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页 */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  显示第 <span>{startItem}</span> - <span>{endItem}</span> 条，共 <span>{totalItems}</span> 条
                </span>
                <select 
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="10">10条/页</option>
                  <option value="20">20条/页</option>
                  <option value="50">50条/页</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="flex items-center space-x-1">
                  {generatePageNumbers().map(pageNum => (
                    <button 
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded text-sm ${
                        pageNum === currentPage 
                          ? 'bg-primary text-white border-primary' 
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 作品预览模态框 */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={() => setShowPreviewModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden`}>
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">{previewWorkData?.name || '作品预览'}</h3>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <i className="fas fa-times text-gray-400"></i>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                {previewWorkData && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={previewWorkData.thumbnail} 
                        alt={previewWorkData.name} 
                        className="w-32 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="text-lg font-semibold">{previewWorkData.name}</h4>
                        <p className="text-sm text-gray-600">类型：{previewWorkData.type}</p>
                        <p className="text-sm text-gray-600">创建时间：{previewWorkData.created}</p>
                        <p className="text-sm text-gray-600">状态：{previewWorkData.status}</p>
                        <p className="text-sm text-gray-600">时长：{previewWorkData.duration}</p>
                        <p className="text-sm text-gray-600">分镜数：{previewWorkData.scenes} 个</p>
                      </div>
                    </div>
                    {previewWorkData.type === '视频' ? (
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex items-center justify-center py-8">
                          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
                            <i className="fas fa-play mr-2"></i>播放视频
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({length: Math.min(previewWorkData.scenes, 6)}, (_, i) => (
                          <img 
                            key={i}
                            src={previewWorkData.thumbnail} 
                            alt={`分镜 ${i+1}`} 
                            className="w-full h-20 rounded object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 分享模态框 */}
      {showShareModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={() => setShowShareModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-xl shadow-xl max-w-md w-full`}>
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">分享作品</h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <i className="fas fa-times text-gray-400"></i>
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">分享链接</label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      value={`https://manyingxu.com/share/${shareWorkId}`}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <button 
                      onClick={handleCopyShareLink}
                      className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                    <i className="fas fa-qrcode text-4xl text-gray-400"></i>
                  </div>
                  <p className="text-sm text-gray-600">扫描二维码分享</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 重命名模态框 */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={() => setShowRenameModal(false)}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-xl shadow-xl max-w-md w-full`}>
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">重命名作品</h3>
                <button 
                  onClick={() => setShowRenameModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <i className="fas fa-times text-gray-400"></i>
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">新名称</label>
                  <input 
                    type="text" 
                    value={newWorkName}
                    onChange={(e) => setNewWorkName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    onClick={() => setShowRenameModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button 
                    onClick={handleConfirmRename}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
                  >
                    确认
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

export default WorksManagementPage;

