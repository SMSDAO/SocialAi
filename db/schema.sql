-- SocialAi Database Schema
-- PostgreSQL 14+

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farcaster_id BIGINT UNIQUE,
    ethereum_address VARCHAR(42) UNIQUE,
    ens_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    username VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    website_url TEXT,
    twitter_handle VARCHAR(255),
    claimed BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table (internal posts)
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    media_urls TEXT[],
    parent_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    root_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    reply_count INTEGER DEFAULT 0,
    recast_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- External posts table (from Farcaster, Reddit, etc.)
CREATE TABLE IF NOT EXISTS external_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(50) NOT NULL, -- 'farcaster', 'reddit', etc.
    author_id VARCHAR(255),
    author_name VARCHAR(255),
    content TEXT,
    media_urls TEXT[],
    url TEXT,
    parent_id VARCHAR(255),
    reply_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- Likes table
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    external_post_id UUID REFERENCES external_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT like_target_check CHECK (
        (post_id IS NOT NULL AND external_post_id IS NULL) OR
        (post_id IS NULL AND external_post_id IS NOT NULL)
    )
);

-- Claims table (identity verification)
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    claim_type VARCHAR(50) NOT NULL, -- 'farcaster', 'ethereum', 'ens'
    claim_value VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP
);

-- Embeddings table (for AI features)
CREATE TABLE IF NOT EXISTS embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'post', 'profile', 'external_post'
    embedding vector(1536), -- OpenAI ada-002 dimension
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feature flags table
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flag_name VARCHAR(255) UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_farcaster_id ON users(farcaster_id);
CREATE INDEX IF NOT EXISTS idx_users_ethereum_address ON users(ethereum_address);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_external_posts_source ON external_posts(source);
CREATE INDEX IF NOT EXISTS idx_external_posts_external_id ON external_posts(external_id);
CREATE INDEX IF NOT EXISTS idx_external_posts_created_at ON external_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_content_id ON embeddings(content_id);

-- Insert default feature flags
INSERT INTO feature_flags (flag_name, enabled, description) VALUES
    ('farcaster_sync', true, 'Enable Farcaster data synchronization'),
    ('reddit_sync', false, 'Enable Reddit data synchronization'),
    ('ai_summaries', true, 'Enable AI-powered content summaries'),
    ('ai_recommendations', true, 'Enable AI-powered recommendations'),
    ('public_profiles', true, 'Enable public profile pages'),
    ('identity_claims', true, 'Enable identity claim system'),
    ('search_enabled', true, 'Enable search functionality')
ON CONFLICT (flag_name) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
    ('sync_interval', '{"minutes": 5}', 'Interval for worker synchronization'),
    ('max_workers', '{"count": 7}', 'Maximum number of parallel workers'),
    ('rate_limit', '{"requests_per_minute": 100}', 'API rate limiting configuration'),
    ('maintenance_mode', '{"enabled": false}', 'System maintenance mode flag')
ON CONFLICT (key) DO NOTHING;
