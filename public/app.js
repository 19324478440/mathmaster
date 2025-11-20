// API 配置
const API_CONFIG = {
    getBaseUrl: () => {
        // 自动检测环境：本地开发使用 localhost，生产环境使用相对路径
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:3001';
        }
        return ''; // 生产环境使用相对路径，与前端同域
    }
};

// 加载状态管理
let loadingOverlay = null;

function showLoading() {
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingOverlay);
    }
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// API 请求函数
async function fetchWithToken(url, options = {}) {
    const fullUrl = API_CONFIG.getBaseUrl() + url;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // 如果不是登录或注册请求，添加认证token
    if (url !== '/api/login' && url !== '/api/register') {
        const token = localStorage.getItem('token');
        if (token) {
            defaultOptions.headers.Authorization = `Bearer ${token}`;
        }
    }

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(fullUrl, mergedOptions);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMsg = errorData.error || `HTTP错误 ${response.status}`;
            console.error('API错误响应:', response.status, errorData);
            throw new Error(errorMsg);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API请求错误:', error);
        console.error('请求URL:', fullUrl);
        throw error;
    }
}

// 通知功能
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#67c23a' : type === 'error' ? '#f56c6c' : '#909399'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    // 添加动画样式（如果还没有）
    if (!document.getElementById('notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 页面切换
function showPage(pageId, eventElement) {
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    if (eventElement) {
        eventElement.classList.add('active');
    }
    
    // 关闭移动端菜单
    closeMobileMenu();
}

// 移动端菜单
function openMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.style.display = 'block';
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.style.display = 'none';
    }
}

// 当前主题和关卡状态
let currentTheme = null;
let currentLevel = null;

// 更新用户信息
function updateUserInfo(user) {
    if (!user) {
        console.warn('updateUserInfo: user参数为空');
        return;
    }
    
    try {
        const userNameEl = document.getElementById('userName');
        const userGradeEl = document.getElementById('userGrade');
        const userSpecialtyEl = document.getElementById('userSpecialty');
        const userGoalEl = document.getElementById('userGoal');
        const userChallengeEl = document.getElementById('userChallenge');
        
        if (userNameEl) userNameEl.textContent = user.name || user.username || '用户';
        if (userGradeEl) userGradeEl.textContent = user.grade || '未设置';
        if (userSpecialtyEl) userSpecialtyEl.textContent = user.specialty || '未设置';
        if (userGoalEl) userGoalEl.textContent = user.learning_goal || '未设置';
        if (userChallengeEl) userChallengeEl.textContent = user.challenge_direction || '未设置';
        
        const stats = user.statistics || {};
        const completedLevelsEl = document.getElementById('completedLevels');
        const notesCountEl = document.getElementById('notesCount');
        const consecutiveDaysEl = document.getElementById('consecutiveDays');
        const pointsEl = document.getElementById('points');
        
        if (completedLevelsEl) completedLevelsEl.textContent = stats.completed_levels || 0;
        if (notesCountEl) notesCountEl.textContent = stats.notes_count || 0;
        if (consecutiveDaysEl) consecutiveDaysEl.textContent = stats.consecutive_days || 0;
        if (pointsEl) pointsEl.textContent = stats.points || 0;
    } catch (error) {
        console.error('updateUserInfo错误:', error);
    }
}

// 更新用户统计信息
function updateUserStats() {
    fetchWithToken('/api/user')
        .then(user => {
            updateUserInfo(user);
        })
        .catch(error => {
            console.error('更新用户信息失败:', error);
        });
}

// 开始主题学习
function startTheme(themeName) {
    currentTheme = themeName;
    showThemeDetailPage(themeName);
}

// 显示主题详情页面
function showThemeDetailPage(themeName) {
    const details = {
        '函数的奥秘': {
            icon: '🎡',
            description: '通过游乐园摩天轮的运动轨迹，理解函数输入与输出的关系，感受数学描述现实世界的美妙。',
            concepts: ['定义域与值域', '函数的表示方法', '函数的单调性', '函数的奇偶性'],
            example: '摩天轮高度 h(t) = 20sin(πt/10) + 35',
            levels: 6
        },
        '指数与对数': {
            icon: '🧬',
            description: '观察生物细胞分裂过程，体验指数爆炸式增长，理解指数函数的威力与对数的运算规律。',
            concepts: ['指数函数的性质', '对数运算规则', '指数与对数的关系', '实际应用问题'],
            example: '细胞分裂：N(t) = N₀ × 2^t',
            levels: 6
        },
        '三角函数': {
            icon: '🌊',
            description: '通过海洋潮汐的周期性涨落，掌握三角函数的周期特性，理解正弦余弦的波动规律。',
            concepts: ['任意角与弧度制', '三角函数的定义', '诱导公式', '三角函数的图像与性质'],
            example: '潮汐高度：h(t) = 2sin(πt/6) + 3',
            levels: 6
        },
        '数列与求和': {
            icon: '💰',
            description: '通过理财投资的复利计算，体会数列递推与求和的实际应用，掌握数学建模思维。',
            concepts: ['等差数列', '等比数列', '数列求和方法', '递推数列'],
            example: '复利计算：A = P(1 + r)^n',
            levels: 6
        },
        '导数初探': {
            icon: '🚗',
            description: '分析汽车从静止到高速的加速曲线，理解导数描述变化率的本质，掌握微积分基础。',
            concepts: ['导数的定义', '导数的几何意义', '基本求导公式', '导数的应用'],
            example: '瞬时速度：v = ds/dt',
            levels: 6
        },
        '概率统计': {
            icon: '🎲',
            description: '通过日常抽奖游戏，理解概率统计的基本概念，学会用数学思维分析随机事件。',
            concepts: ['随机事件', '概率的计算', '统计图表', '统计量分析'],
            example: '抽奖概率：P = 有利事件数 / 总事件数',
            levels: 6
        }
    };
    
    const detail = details[themeName];
    if (!detail) return;

    showLoading();
    fetchWithToken('/api/progress')
        .then(progress => {
            hideLoading();
            const themeProgress = progress[themeName] || [];
            
            document.getElementById('themeDetailTitle').textContent = `${detail.icon} ${themeName}`;
            const content = document.getElementById('themeDetailContent');
            
            let levelsHtml = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px;">';
            for (let i = 1; i <= detail.levels; i++) {
                const levelData = themeProgress.find(l => l.level === i);
                const isCompleted = levelData && levelData.completed;
                levelsHtml += `
                    <div class="theme-card" style="cursor: pointer;" onclick="showLevelDetail('${themeName}', ${i})">
                        <div class="theme-icon">${isCompleted ? '✓' : i}</div>
                        <h3>第 ${i} 关${isCompleted ? ' (已完成)' : ''}</h3>
                        <p>点击开始学习第 ${i} 关的内容</p>
                        <button class="btn btn-primary">${isCompleted ? '复习' : '开始'}</button>
                    </div>
                `;
            }
            levelsHtml += '</div>';

            content.innerHTML = `
                <div style="background: var(--background-color); border-radius: 15px; padding: 30px; margin-bottom: 20px;">
                    <h3 style="margin-bottom: 15px;">📖 主题介绍</h3>
                    <p style="line-height: 1.8; color: var(--text-regular); margin-bottom: 20px;">${detail.description}</p>
                    
                    <h3 style="margin-top: 25px; margin-bottom: 15px;">💡 核心概念</h3>
                    <ul style="line-height: 2; color: var(--text-regular); margin-left: 20px;">
                        ${detail.concepts.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                    
                    <h3 style="margin-top: 25px; margin-bottom: 15px;">🌟 生活实例</h3>
                    <p style="line-height: 1.8; color: var(--text-regular); background: white; padding: 15px; border-radius: 8px; font-family: monospace;">
                        ${detail.example}
                    </p>
                </div>
                <h3 style="margin-bottom: 20px;">🎯 关卡列表</h3>
                ${levelsHtml}
            `;
            
            showPage('themeDetail', null);
        })
        .catch(error => {
            hideLoading();
            console.error('加载进度失败:', error);
            showNotification('加载进度失败，请稍后重试', 'error');
        });
}

// 显示关卡详情
function showLevelDetail(themeName, level) {
    currentTheme = themeName;
    currentLevel = level;
    
    const levelContents = {
        '函数的奥秘': {
            1: { title: '函数的定义', content: '理解函数的概念：对于集合A中的每一个元素x，在集合B中都有唯一确定的元素y与之对应。', question: '函数f(x) = x²的定义域是什么？', answer: '所有实数' },
            2: { title: '定义域与值域', content: '定义域是函数自变量的取值范围，值域是函数因变量的取值范围。', question: '函数f(x) = √(x-2)的定义域是什么？', answer: '[2, +∞)' },
            3: { title: '函数的表示方法', content: '函数可以用解析式、图像、表格三种方式表示。', question: '函数y = 2x + 1的图像是什么？', answer: '一条斜率为2的直线' },
            4: { title: '函数的单调性', content: '函数在某个区间内，如果x₁ < x₂时f(x₁) < f(x₂)，则函数在该区间内单调递增。', question: '函数f(x) = x²在(0, +∞)上的单调性？', answer: '单调递增' },
            5: { title: '函数的奇偶性', content: '如果f(-x) = f(x)，则函数为偶函数；如果f(-x) = -f(x)，则函数为奇函数。', question: '函数f(x) = x³的奇偶性？', answer: '奇函数' },
            6: { title: '函数的综合应用', content: '综合运用函数的各种性质解决实际问题。', question: '摩天轮高度函数h(t) = 20sin(πt/10) + 35的周期是多少？', answer: '20秒' }
        }
    };

    const levelData = levelContents[themeName]?.[level] || {
        title: `第 ${level} 关`,
        content: `这是${themeName}主题的第${level}关内容。`,
        question: '请完成本关的学习任务。',
        answer: '完成'
    };

    document.getElementById('levelDetailTitle').textContent = `${themeName} - ${levelData.title}`;
    const content = document.getElementById('levelDetailContent');
    
    content.innerHTML = `
        <div style="background: var(--background-color); border-radius: 15px; padding: 30px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 15px;">📚 学习内容</h3>
            <p style="line-height: 1.8; color: var(--text-regular); margin-bottom: 20px;">${levelData.content}</p>
        </div>
        
        <div style="background: var(--background-color); border-radius: 15px; padding: 30px; margin-bottom: 20px;">
            <h3 style="margin-bottom: 15px;">❓ 思考题</h3>
            <p style="line-height: 1.8; color: var(--text-regular); margin-bottom: 20px; font-weight: bold;">${levelData.question}</p>
            <details style="margin-top: 15px;">
                <summary style="cursor: pointer; color: var(--primary-color); font-weight: 500;">点击查看答案</summary>
                <p style="margin-top: 10px; padding: 15px; background: white; border-radius: 8px; color: var(--text-regular);">${levelData.answer}</p>
            </details>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button class="btn btn-primary" onclick="completeCurrentLevel()" style="padding: 15px 40px; font-size: 16px;">
                ✓ 完成本关
            </button>
        </div>
    `;
    
    showPage('levelDetail', null);
}

// 完成当前关卡
function completeCurrentLevel() {
    if (!currentTheme || !currentLevel) return;
    
    showLoading();
    completeLevel(currentTheme, currentLevel.toString(), null);
}

// 从关卡详情返回
function goBackFromLevel() {
    if (currentTheme) {
        showThemeDetailPage(currentTheme);
    } else {
        showPage('contextLearning', null);
    }
}

// 完成关卡
function completeLevel(theme, level, element) {
    fetchWithToken('/api/progress/update', {
        method: 'POST',
        body: JSON.stringify({ theme, level: parseInt(level) })
    })
    .then(data => {
        hideLoading();
        showNotification('恭喜完成关卡！获得10积分', 'success');
        if (element) {
            element.classList.add('completed');
            element.innerHTML = `<span>${level}</span> ✓`;
        }
        updateUserStats();
        loadUserProgress();
        setTimeout(() => {
            if (currentTheme) {
                showThemeDetailPage(currentTheme);
            }
        }, 1000);
    })
    .catch(error => {
        hideLoading();
        console.error('更新进度失败:', error);
        showNotification('更新进度失败，请稍后重试', 'error');
    });
}

// 加载用户学习进度
function loadUserProgress() {
    fetchWithToken('/api/progress')
        .then(progress => {
            updateProgressDisplay(progress);
        })
        .catch(error => {
            console.error('加载进度失败:', error);
        });
}

// 更新进度显示
function updateProgressDisplay(progress) {
    for (const theme in progress) {
        const levels = progress[theme];
        levels.forEach(level => {
            const levelElement = document.querySelector(`.level-item[data-theme="${theme}"][data-level="${level.level}"]`);
            if (levelElement) {
                if (level.completed) {
                    levelElement.classList.add('completed');
                    levelElement.innerHTML = `<span>${level.level}</span> ✓`;
                }
            }
        });
    }
}

// 分页相关变量
let currentNotesPage = 1;
const notesPerPage = 3;
let allNotes = [];

// 加载心得列表
function loadNotes() {
    showLoading();
    fetchWithToken('/api/notes')
        .then(notes => {
            hideLoading();
            allNotes = notes;
            currentNotesPage = 1;
            renderNotesList();
        })
        .catch(error => {
            hideLoading();
            console.error('加载心得失败:', error);
            showNotification('加载心得失败，请稍后重试', 'error');
        });
}

// 渲染心得列表（带分页）
function renderNotesList() {
    const notesContainer = document.getElementById('notesList');
    if (!notesContainer) return;

    const startIndex = (currentNotesPage - 1) * notesPerPage;
    const endIndex = startIndex + notesPerPage;
    const currentPageNotes = allNotes.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allNotes.length / notesPerPage);

    notesContainer.innerHTML = '';
    
    if (currentPageNotes.length === 0) {
        notesContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">暂无心得</p>';
    } else {
        currentPageNotes.forEach(note => {
            const noteCard = document.createElement('div');
            noteCard.className = 'note-card fade-in';
            const typeClass = note.type === '入门心得' ? 'type-basic' : 
                             note.type === '进阶心得' ? 'type-advanced' : 'type-challenge';
            noteCard.innerHTML = `
                <div class="note-header">
                    <h3 class="note-title">${note.title}</h3>
                    <span class="note-type ${typeClass}">${note.type}</span>
                </div>
                <p class="note-content">${note.content}</p>
                <div class="note-footer">
                    <div>👤 ${note.name || note.username} · ${new Date(note.createdAt).toLocaleDateString()}</div>
                    <div class="note-actions">
                        <span onclick="likeNote(${note.id})" style="cursor: pointer;">👍 ${note.likes}</span>
                        <span>💬 ${note.comments_count}</span>
                        <span>⭐ 收藏</span>
                    </div>
                </div>
            `;
            notesContainer.appendChild(noteCard);
        });
    }

    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    
    if (pageInfo) pageInfo.textContent = `第 ${currentNotesPage} 页，共 ${totalPages} 页`;
    if (prevBtn) prevBtn.disabled = currentNotesPage === 1;
    if (nextBtn) nextBtn.disabled = currentNotesPage === totalPages || totalPages === 0;
}

// 切换心得页面
function changeNotesPage(direction) {
    const totalPages = Math.ceil(allNotes.length / notesPerPage);
    const newPage = currentNotesPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentNotesPage = newPage;
        renderNotesList();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 点赞心得
function likeNote(noteId) {
    fetchWithToken(`/api/notes/${noteId}/like`, {
        method: 'POST'
    })
    .then(data => {
        showNotification('点赞成功！', 'success');
        loadNotes();
    })
    .catch(error => {
        console.error('点赞失败:', error);
        showNotification('点赞失败，请稍后重试', 'error');
    });
}

// 每日打卡
function doCheckIn() {
    showLoading();
    fetchWithToken('/api/checkin', {
        method: 'POST'
    })
    .then(data => {
        hideLoading();
        showNotification(data.message || '打卡成功！', 'success');
        updateUserStats();
    })
    .catch(error => {
        hideLoading();
        console.error('打卡失败:', error);
        showNotification('打卡失败，请稍后重试', 'error');
    });
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('token');
        document.getElementById('mainApp').classList.remove('active');
        document.getElementById('loginPage').classList.add('active');
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
        showNotification('已成功退出登录', 'info');
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载动画
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // 关卡点击事件
    document.querySelectorAll('.level-item').forEach(item => {
        item.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            const level = this.getAttribute('data-level');
            showLevelDetail(theme, parseInt(level));
        });
    });
    
    // 快速登录按钮
    const quickLoginBtn = document.getElementById('quickLoginBtn');
    if (quickLoginBtn) {
        quickLoginBtn.addEventListener('click', async function() {
            try {
                showLoading();
                const result = await fetchWithToken('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({ username: 'demo', password: 'demo' })
                });
                
                localStorage.setItem('token', result.token);
                document.getElementById('loginPage').classList.remove('active');
                document.getElementById('mainApp').classList.add('active');
                
                loadUserProgress();
                loadNotes();
                hideLoading();
                showNotification('欢迎使用数学学习网站！', 'success');
            } catch (error) {
                hideLoading();
                showNotification('登录失败，请重试', 'error');
            }
        });
    }
    
    // 切换登录/注册表单
    const switchToRegisterBtn = document.getElementById('switchToRegisterBtn');
    const switchToLoginBtn = document.getElementById('switchToLoginBtn');
    
    if (switchToRegisterBtn) {
        switchToRegisterBtn.addEventListener('click', function() {
            document.getElementById('loginCard').style.display = 'none';
            document.getElementById('registerCard').style.display = 'block';
        });
    }
    
    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', function() {
            document.getElementById('registerCard').style.display = 'none';
            document.getElementById('loginCard').style.display = 'block';
        });
    }
    
    // 注册功能
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('regUsername').value.trim();
            const password = document.getElementById('regPassword').value;
            const passwordConfirm = document.getElementById('regPasswordConfirm').value;
            const name = document.getElementById('regName').value.trim();
            const grade = document.getElementById('regGrade').value;
            const specialty = document.getElementById('regSpecialty').value.trim();
            const learningGoal = document.getElementById('regLearningGoal').value.trim();
            const challengeDirection = document.getElementById('regChallengeDirection').value.trim();
            
            if (!username) {
                showNotification('请输入用户名', 'error');
                return;
            }
            
            if (!password) {
                showNotification('请输入密码', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('密码长度不能少于6个字符', 'error');
                return;
            }
            
            if (password !== passwordConfirm) {
                showNotification('两次输入的密码不一致', 'error');
                return;
            }
            
            showLoading();
            try {
                const data = await fetchWithToken('/api/register', {
                    method: 'POST',
                    body: JSON.stringify({
                        username,
                        password,
                        name: name || undefined,
                        grade: grade || undefined,
                        specialty: specialty || undefined,
                        learning_goal: learningGoal || undefined,
                        challenge_direction: challengeDirection || undefined
                    })
                });
                
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    document.getElementById('loginPage').classList.remove('active');
                    document.getElementById('mainApp').classList.add('active');
                    setTimeout(() => {
                        updateUserInfo(data.user);
                        loadUserProgress();
                        loadNotes();
                    }, 0);
                    hideLoading();
                    showNotification('注册成功！欢迎来到 MathMaster', 'success');
                } else {
                    hideLoading();
                    showNotification(data.error || '注册失败，请稍后重试！', 'error');
                }
            } catch (error) {
                hideLoading();
                console.error('注册错误:', error);
                showNotification('注册失败: ' + (error.message || '请稍后重试！'), 'error');
            }
        });
    }
    
    // 登录功能
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            
            if (!username) {
                showNotification('请输入用户名', 'error');
                return;
            }
            
            const password = document.getElementById('password').value;
            const loginPassword = (username === 'demo' && !password) ? 'demo' : password;
            
            showLoading();
            try {
                const data = await fetchWithToken('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({ username, password: loginPassword })
                });
                
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    document.getElementById('loginPage').classList.remove('active');
                    document.getElementById('mainApp').classList.add('active');
                    setTimeout(() => {
                        updateUserInfo(data.user);
                        loadUserProgress();
                        loadNotes();
                    }, 0);
                    hideLoading();
                    showNotification('登录成功！欢迎来到 MathMaster', 'success');
                } else {
                    hideLoading();
                    showNotification(data.error || data.message || '用户名或密码错误！', 'error');
                }
            } catch (error) {
                hideLoading();
                console.error('登录错误:', error);
                showNotification('登录失败: ' + (error.message || '请稍后重试！'), 'error');
            }
        });
    }
    
    // 联系表单提交
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const contact = document.getElementById('contactContact').value;
            const message = document.getElementById('contactMessage').value;
            
            showLoading();
            fetchWithToken('/api/contact', {
                method: 'POST',
                body: JSON.stringify({ name, contact, message })
            })
            .then(data => {
                hideLoading();
                showNotification(data.message || '反馈提交成功！我们会尽快回复您。', 'success');
                this.reset();
            })
            .catch(error => {
                hideLoading();
                console.error('提交反馈失败:', error);
                showNotification('提交失败，请稍后重试！', 'error');
            });
        });
    }
    
    // 移动端菜单按钮
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }
    
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // 移动端菜单链接点击后关闭菜单
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // 如果有token，自动登录
    const token = localStorage.getItem('token');
    if (token) {
        showLoading();
        fetchWithToken('/api/user')
            .then(user => {
                document.getElementById('loginPage').classList.remove('active');
                document.getElementById('mainApp').classList.add('active');
                setTimeout(() => {
                    updateUserInfo(user);
                    loadUserProgress();
                    loadNotes();
                }, 0);
                hideLoading();
            })
            .catch(error => {
                hideLoading();
                localStorage.removeItem('token');
            });
    }
});

