-- Myanmar DJ Platform Database Schema
-- 这个文件包含了在Supabase中需要创建的所有表结构

-- 用户表
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'dj', 'admin', 'super_admin')),
    balance DECIMAL(10,2) DEFAULT 0.00,
    is_dj BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    nickname VARCHAR(100),
    bio TEXT,
    kpay_qr_url TEXT,
    kpay_account VARCHAR(100),
    kbz_account VARCHAR(100),
    kbz_account_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- 音乐轨道表
CREATE TABLE tracks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    duration INTEGER DEFAULT 0, -- 秒数
    file_url TEXT,
    cover_url TEXT,
    uploader_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plays INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    genre VARCHAR(100),
    tags TEXT[], -- PostgreSQL数组类型
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DJ认证申请表
CREATE TABLE dj_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- 交易记录表
CREATE TABLE transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('recharge', 'withdraw', 'tip', 'commission', 'vip_purchase')),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    payment_method VARCHAR(50), -- 'kpay', 'kbz_banking'
    payment_screenshot_url TEXT,
    reference_id VARCHAR(100), -- 外部支付系统的参考ID
    description TEXT,
    processed_by UUID REFERENCES users(id), -- 处理该交易的管理员
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 用户喜欢的音乐表
CREATE TABLE user_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, track_id)
);

-- 播放历史表
CREATE TABLE play_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_played INTEGER DEFAULT 0 -- 播放时长（秒）
);

-- 打赏记录表
CREATE TABLE tips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    track_id UUID REFERENCES tracks(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 系统通知表
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general', -- 'general', 'maintenance', 'promotion', 'warning'
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- VIP会员记录表
CREATE TABLE vip_memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) NOT NULL, -- 'monthly', 'yearly'
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 机器人客服对话表
CREATE TABLE bot_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT,
    is_from_user BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_tracks_uploader ON tracks(uploader_id);
CREATE INDEX idx_tracks_created_at ON tracks(created_at DESC);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_play_history_user_id ON play_history(user_id);
CREATE INDEX idx_play_history_track_id ON play_history(track_id);
CREATE INDEX idx_user_likes_user_id ON user_likes(user_id);
CREATE INDEX idx_user_likes_track_id ON user_likes(track_id);

-- 创建更新时间的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要自动更新updated_at字段的表创建触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON tracks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dj_applications_updated_at BEFORE UPDATE ON dj_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入一些示例数据（可选）
-- 注意：在生产环境中，超级管理员账户应该通过安全的方式创建

-- 示例音乐分类数据
INSERT INTO tracks (title, artist, duration, genre, tags, cover_url) VALUES
('Vietnamese Drum Beat 1', 'DJ Myanmar', 180, 'Electronic', ARRAY['vietnamese', 'drum', 'electronic'], 'https://via.placeholder.com/300x300/ff6b35/ffffff?text=DJ+1'),
('Tropical House Mix', 'DJ Yangon', 240, 'House', ARRAY['tropical', 'house', 'mix'], 'https://via.placeholder.com/300x300/004e89/ffffff?text=DJ+2'),
('Electronic Fusion', 'DJ Mandalay', 200, 'Electronic', ARRAY['electronic', 'fusion'], 'https://via.placeholder.com/300x300/ffd23f/000000?text=DJ+3'),
('Bass Drop Anthem', 'DJ Naypyidaw', 220, 'Bass', ARRAY['bass', 'anthem', 'drop'], 'https://via.placeholder.com/300x300/ff6b35/ffffff?text=DJ+4');

-- 示例通知数据
INSERT INTO notifications (title, content, type, created_at) VALUES
('欢迎来到缅甸DJ平台', '感谢您注册我们的平台！在这里您可以发现最棒的越南鼓DJ音乐。', 'general', NOW()),
('三天免费试听活动', '新用户注册即可享受三天免费试听所有音乐！', 'promotion', NOW()),
('平台功能更新', '我们新增了DJ排行榜和打赏功能，快来体验吧！', 'general', NOW());

