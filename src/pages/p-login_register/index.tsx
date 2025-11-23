

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

type FormMode = 'login' | 'register' | 'forgot';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface ForgotFormData {
  email: string;
}

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

const LoginRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<FormMode>('login');
  
  // 表单数据
  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  const [forgotFormData, setForgotFormData] = useState<ForgotFormData>({
    email: ''
  });
  
  // 密码可见性
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  // 错误信息
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});
  const [forgotErrors, setForgotErrors] = useState<FormErrors>({});
  
  // 提交状态
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] = useState(false);
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '登录注册 - 漫影叙';
    return () => { document.title = originalTitle; };
  }, []);

  // 验证函数
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // 模式切换函数
  const switchToLogin = () => {
    setCurrentMode('login');
    setLoginErrors({});
  };

  const switchToRegister = () => {
    setCurrentMode('register');
    setRegisterErrors({});
  };

  const switchToForgotPassword = () => {
    setCurrentMode('forgot');
    setForgotErrors({});
  };

  // 登录表单提交
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: FormErrors = {};
    
    // 验证邮箱
    if (!loginFormData.email) {
      errors.email = '请输入邮箱地址';
    } else if (!validateEmail(loginFormData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    // 验证密码
    if (!loginFormData.password) {
      errors.password = '请输入密码';
    }
    
    setLoginErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsLoginSubmitting(true);
      
      // 模拟登录过程
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    }
  };

  // 注册表单提交
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: FormErrors = {};
    
    // 验证邮箱
    if (!registerFormData.email) {
      errors.email = '请输入邮箱地址';
    } else if (!validateEmail(registerFormData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    // 验证用户名
    if (!registerFormData.username) {
      errors.username = '请输入用户名';
    } else if (registerFormData.username.length < 3) {
      errors.username = '用户名至少需要3个字符';
    }
    
    // 验证密码
    if (!registerFormData.password) {
      errors.password = '请输入密码';
    } else if (!validatePassword(registerFormData.password)) {
      errors.password = '密码至少需要8个字符';
    }
    
    // 验证确认密码
    if (!registerFormData.confirmPassword) {
      errors.confirmPassword = '请确认密码';
    } else if (registerFormData.password !== registerFormData.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
    }
    
    setRegisterErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      if (!registerFormData.agreeTerms) {
        alert('请先同意用户协议和隐私政策');
        return;
      }
      
      setIsRegisterSubmitting(true);
      
      // 模拟注册过程
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    }
  };

  // 忘记密码表单提交
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: FormErrors = {};
    
    // 验证邮箱
    if (!forgotFormData.email) {
      errors.email = '请输入邮箱地址';
    } else if (!validateEmail(forgotFormData.email)) {
      errors.email = '请输入有效的邮箱地址';
    }
    
    setForgotErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsForgotSubmitting(true);
      
      // 模拟发送邮件过程
      setTimeout(() => {
        alert('重置密码的邮件已发送，请查收您的邮箱');
        switchToLogin();
      }, 1500);
    }
  };

  // 第三方登录处理
  const handleWechatLogin = () => {
    console.log('需要调用第三方接口实现微信登录');
    alert('微信登录功能开发中...');
  };

  const handleQQLogin = () => {
    console.log('需要调用第三方接口实现QQ登录');
    alert('QQ登录功能开发中...');
  };

  const handleGithubLogin = () => {
    console.log('需要调用第三方接口实现GitHub登录');
    alert('GitHub登录功能开发中...');
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 主容器 */}
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* 背景装饰 */}
        <div className={`absolute inset-0 ${styles.heroGradient} opacity-5`}></div>
        
        {/* 登录注册卡片 */}
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden">
          {/* 卡片头部 */}
          <div className="bg-gradient-primary p-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <i className="fas fa-video text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-white">漫影叙</h1>
            </div>
            <p className="text-white text-opacity-90">AI赋能，让创意触手可及</p>
          </div>
          
          {/* 标签切换 */}
          <div className="flex bg-gray-100 px-4 py-2">
            <button 
              onClick={switchToLogin}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                currentMode === 'login' ? styles.tabActive : styles.tabInactive
              }`}
            >
              登录
            </button>
            <button 
              onClick={switchToRegister}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                currentMode === 'register' ? styles.tabActive : styles.tabInactive
              } ml-2`}
            >
              注册
            </button>
          </div>
          
          {/* 表单内容 */}
          <div className="p-8">
            {/* 登录表单 */}
            {currentMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="block text-sm font-medium text-text-primary">邮箱</label>
                  <input 
                    type="email" 
                    id="login-email" 
                    value={loginFormData.email}
                    onChange={(e) => setLoginFormData({...loginFormData, email: e.target.value})}
                    className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all`}
                    placeholder="请输入邮箱地址" 
                    required 
                  />
                  {loginErrors.email && <div className={styles.errorMessage}>{loginErrors.email}</div>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="login-password" className="block text-sm font-medium text-text-primary">密码</label>
                  <div className="relative">
                    <input 
                      type={loginPasswordVisible ? 'text' : 'password'} 
                      id="login-password" 
                      value={loginFormData.password}
                      onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})}
                      className={`w-full px-4 py-3 pr-12 border border-border-light rounded-lg ${styles.formInputFocus} transition-all`}
                      placeholder="请输入密码" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setLoginPasswordVisible(!loginPasswordVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <i className={`fas ${loginPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {loginErrors.password && <div className={styles.errorMessage}>{loginErrors.password}</div>}
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={loginFormData.rememberMe}
                      onChange={(e) => setLoginFormData({...loginFormData, rememberMe: e.target.checked})}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" 
                    />
                    <span className="ml-2 text-sm text-text-secondary">记住我</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={switchToForgotPassword}
                    className="text-sm text-primary hover:underline"
                  >
                    忘记密码？
                  </button>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isLoginSubmitting}
                  className={`w-full ${styles.btnGradient} text-white py-3 rounded-lg font-semibold text-lg`}
                >
                  <i className={`fas ${isLoginSubmitting ? 'fa-spinner fa-spin' : 'fa-sign-in-alt'} mr-2`}></i>
                  {isLoginSubmitting ? '登录中...' : '登录'}
                </button>
              </form>
            )}
            
            {/* 注册表单 */}
            {currentMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="register-email" className="block text-sm font-medium text-text-primary">邮箱</label>
                  <input 
                    type="email" 
                    id="register-email" 
                    value={registerFormData.email}
                    onChange={(e) => setRegisterFormData({...registerFormData, email: e.target.value})}
                    className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all`}
                    placeholder="请输入邮箱地址" 
                    required 
                  />
                  {registerErrors.email && <div className={styles.errorMessage}>{registerErrors.email}</div>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="register-username" className="block text-sm font-medium text-text-primary">用户名</label>
                  <input 
                    type="text" 
                    id="register-username" 
                    value={registerFormData.username}
                    onChange={(e) => setRegisterFormData({...registerFormData, username: e.target.value})}
                    className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all`}
                    placeholder="请输入用户名" 
                    required 
                  />
                  {registerErrors.username && <div className={styles.errorMessage}>{registerErrors.username}</div>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="register-password" className="block text-sm font-medium text-text-primary">密码</label>
                  <div className="relative">
                    <input 
                      type={registerPasswordVisible ? 'text' : 'password'} 
                      id="register-password" 
                      value={registerFormData.password}
                      onChange={(e) => setRegisterFormData({...registerFormData, password: e.target.value})}
                      className={`w-full px-4 py-3 pr-12 border border-border-light rounded-lg ${styles.formInputFocus} transition-all`}
                      placeholder="请输入密码（至少8位）" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setRegisterPasswordVisible(!registerPasswordVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <i className={`fas ${registerPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {registerErrors.password && <div className={styles.errorMessage}>{registerErrors.password}</div>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="register-confirm-password" className="block text-sm font-medium text-text-primary">确认密码</label>
                  <div className="relative">
                    <input 
                      type={confirmPasswordVisible ? 'text' : 'password'} 
                      id="register-confirm-password" 
                      value={registerFormData.confirmPassword}
                      onChange={(e) => setRegisterFormData({...registerFormData, confirmPassword: e.target.value})}
                      className={`w-full px-4 py-3 pr-12 border border-border-light rounded-lg ${styles.formInputFocus} transition-all`}
                      placeholder="请再次输入密码" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <i className={`fas ${confirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {registerErrors.confirmPassword && <div className={styles.errorMessage}>{registerErrors.confirmPassword}</div>}
                </div>
                
                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    id="agree-terms" 
                    checked={registerFormData.agreeTerms}
                    onChange={(e) => setRegisterFormData({...registerFormData, agreeTerms: e.target.checked})}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1" 
                    required 
                  />
                  <label htmlFor="agree-terms" className="text-sm text-text-secondary">
                    我已阅读并同意
                    <button type="button" className="text-primary hover:underline">《用户协议》</button>
                    和
                    <button type="button" className="text-primary hover:underline">《隐私政策》</button>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isRegisterSubmitting}
                  className={`w-full ${styles.btnGradient} text-white py-3 rounded-lg font-semibold text-lg`}
                >
                  <i className={`fas ${isRegisterSubmitting ? 'fa-spinner fa-spin' : 'fa-user-plus'} mr-2`}></i>
                  {isRegisterSubmitting ? '注册中...' : '注册'}
                </button>
              </form>
            )}
            
            {/* 忘记密码表单 */}
            {currentMode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">重置密码</h3>
                  <p className="text-sm text-text-secondary">请输入您的邮箱地址，我们将发送重置密码的链接到您的邮箱</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-text-primary">邮箱</label>
                  <input 
                    type="email" 
                    id="forgot-email" 
                    value={forgotFormData.email}
                    onChange={(e) => setForgotFormData({...forgotFormData, email: e.target.value})}
                    className={`w-full px-4 py-3 border border-border-light rounded-lg ${styles.formInputFocus} transition-all`}
                    placeholder="请输入邮箱地址" 
                    required 
                  />
                  {forgotErrors.email && <div className={styles.errorMessage}>{forgotErrors.email}</div>}
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    type="button" 
                    onClick={switchToLogin}
                    className="flex-1 bg-gray-100 text-text-primary py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    返回登录
                  </button>
                  <button 
                    type="submit" 
                    disabled={isForgotSubmitting}
                    className={`flex-1 ${styles.btnGradient} text-white py-3 rounded-lg font-semibold`}
                  >
                    <i className={`fas ${isForgotSubmitting ? 'fa-spinner fa-spin' : 'fa-envelope'} mr-2`}></i>
                    {isForgotSubmitting ? '发送中...' : '发送邮件'}
                  </button>
                </div>
              </form>
            )}
            
            {/* 分割线和第三方登录 - 仅在登录和注册模式显示 */}
            {currentMode !== 'forgot' && (
              <>
                {/* 分割线 */}
                <div className="flex items-center my-8">
                  <div className="flex-1 h-px bg-border-light"></div>
                  <span className="px-4 text-sm text-text-secondary">或</span>
                  <div className="flex-1 h-px bg-border-light"></div>
                </div>
                
                {/* 第三方登录 */}
                <div className="space-y-3">
                  <button 
                    onClick={handleWechatLogin}
                    className={`w-full ${styles.socialBtn} bg-green-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center`}
                  >
                    <i className="fab fa-weixin text-xl mr-3"></i>
                    微信登录
                  </button>
                  <button 
                    onClick={handleQQLogin}
                    className={`w-full ${styles.socialBtn} bg-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center`}
                  >
                    <i className="fab fa-qq text-xl mr-3"></i>
                    QQ登录
                  </button>
                  <button 
                    onClick={handleGithubLogin}
                    className={`w-full ${styles.socialBtn} bg-gray-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center`}
                  >
                    <i className="fab fa-github text-xl mr-3"></i>
                    GitHub登录
                  </button>
                </div>
                
                {/* 切换链接 */}
                <div className="text-center mt-6">
                  <span className="text-sm text-text-secondary">
                    {currentMode === 'login' ? '还没有账号？' : '已有账号？'}
                    <button 
                      onClick={currentMode === 'login' ? switchToRegister : switchToLogin}
                      className="text-primary hover:underline font-medium ml-1"
                    >
                      {currentMode === 'login' ? '立即注册' : '立即登录'}
                    </button>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* 页脚 */}
        <div className="absolute bottom-4 text-center">
          <p className="text-sm text-text-secondary">© 2024 漫影叙. 保留所有权利</p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;

