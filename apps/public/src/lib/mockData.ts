export interface ProfileRecord {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar?: string;
  location?: string;
  website?: string;
  farcasterFid?: number;
  ethereumAddress?: string;
  claimed: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

export interface PostRecord {
  id: string;
  author: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  content: string;
  source: 'farcaster' | 'reddit' | 'internal';
  createdAt: string;
  likesCount: number;
  repliesCount: number;
  repostsCount: number;
}

const initialProfiles: ProfileRecord[] = [
  {
    id: '1',
    username: 'dwr',
    displayName: 'Dan Romero',
    bio: 'Working on Farcaster. Building open social protocols and developer ecosystems.',
    location: 'Los Angeles, CA',
    website: 'https://farcaster.xyz',
    farcasterFid: 3,
    claimed: true,
    followersCount: 412800,
    followingCount: 920,
    postsCount: 2
  },
  {
    id: '2',
    username: 'v',
    displayName: 'Varun Srinivasan',
    bio: 'Co-founder at Farcaster. Distributed systems, hubs, and protocol architecture.',
    location: 'San Francisco, CA',
    website: 'https://varunsrinivasan.com',
    farcasterFid: 2,
    claimed: true,
    followersCount: 298400,
    followingCount: 640,
    postsCount: 1
  },
  {
    id: '3',
    username: 'vitalik',
    displayName: 'Vitalik Buterin',
    bio: 'Ethereum, cryptography, decentralized governance, and public goods.',
    website: 'https://vitalik.eth.limo',
    farcasterFid: 5650,
    ethereumAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    claimed: true,
    followersCount: 540100,
    followingCount: 312,
    postsCount: 1
  },
  {
    id: '4',
    username: 'socialai_index',
    displayName: 'SocialAi Indexer',
    bio: 'Open social discovery engine indexing Farcaster casts, Reddit threads, and on-chain identity claims.',
    location: 'Global Mesh',
    website: 'https://socialai.network',
    farcasterFid: 10001,
    claimed: false,
    followersCount: 18420,
    followingCount: 128,
    postsCount: 2
  }
];

const initialPosts: PostRecord[] = [
  {
    id: 'post-1',
    author: {
      username: 'dwr',
      displayName: 'Dan Romero'
    },
    content: 'Open social graphs unlock permissionless discovery. Anyone can index public casts and build specialized clients on top.',
    source: 'farcaster',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    likesCount: 284,
    repliesCount: 42,
    repostsCount: 67
  },
  {
    id: 'post-2',
    author: {
      username: 'v',
      displayName: 'Varun Srinivasan'
    },
    content: 'Hub sync latency dropped significantly after the latest storage compaction pass. Snapshots are propagating across peers in seconds.',
    source: 'farcaster',
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    likesCount: 193,
    repliesCount: 21,
    repostsCount: 34
  },
  {
    id: 'post-3',
    author: {
      username: 'socialai_index',
      displayName: 'SocialAi Indexer'
    },
    content: 'Trending across r/ethdev & Farcaster: cross-protocol identity verification using SIWE + Farcaster Custody Proofs.',
    source: 'reddit',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    likesCount: 147,
    repliesCount: 19,
    repostsCount: 28
  },
  {
    id: 'post-4',
    author: {
      username: 'vitalik',
      displayName: 'Vitalik Buterin'
    },
    content: 'Credibly neutral social infrastructure matters most when identity portability is preserved across applications.',
    source: 'farcaster',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    likesCount: 812,
    repliesCount: 114,
    repostsCount: 205
  },
  {
    id: 'post-5',
    author: {
      username: 'socialai_index',
      displayName: 'SocialAi Indexer'
    },
    content: 'SmartBrain topic clustering updated: Zero-JS SSR profiles, Decentralized Identity, and Multi-chain RPC indexing.',
    source: 'internal',
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    likesCount: 64,
    repliesCount: 8,
    repostsCount: 15
  },
  {
    id: 'post-6',
    author: {
      username: 'dwr',
      displayName: 'Dan Romero'
    },
    content: 'Claiming your public index profile gives creators direct ownership over metadata, links, and AI summaries.',
    source: 'farcaster',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    likesCount: 215,
    repliesCount: 29,
    repostsCount: 41
  }
];

const profilesStore: ProfileRecord[] = [...initialProfiles];
const postsStore: PostRecord[] = [...initialPosts];

export function getStats() {
  const claimedCount = profilesStore.filter((p) => p.claimed).length;
  return {
    profiles: profilesStore.length,
    posts: postsStore.length,
    claims: claimedCount,
    networks: 3
  };
}

export function listProfiles(limit = 50): ProfileRecord[] {
  return profilesStore.slice(0, limit);
}

export function getProfile(username: string): ProfileRecord | undefined {
  return profilesStore.find(
    (p) => p.username.toLowerCase() === username.toLowerCase()
  );
}

export function listTimeline(limit = 50): PostRecord[] {
  return [...postsStore]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getProfilePosts(username: string, limit = 20): PostRecord[] {
  return postsStore
    .filter((p) => p.author.username.toLowerCase() === username.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function claimWithFarcaster(username: string): ProfileRecord {
  const clean = username.trim().replace(/^@/, '').toLowerCase();
  let profile = getProfile(clean);
  if (profile) {
    profile.claimed = true;
    profile.farcasterFid = profile.farcasterFid || Math.floor(10000 + Math.random() * 90000);
    return profile;
  }

  profile = {
    id: String(profilesStore.length + 1),
    username: clean,
    displayName: clean.charAt(0).toUpperCase() + clean.slice(1),
    bio: `Verified Farcaster profile claimed on SocialAi (@${clean}).`,
    farcasterFid: Math.floor(10000 + Math.random() * 90000),
    claimed: true,
    followersCount: 1,
    followingCount: 0,
    postsCount: 0
  };
  profilesStore.unshift(profile);
  return profile;
}

export function claimWithSiwe(address: string): ProfileRecord {
  const clean = address.trim();
  const isEns = clean.toLowerCase().endsWith('.eth');
  const username = isEns
    ? clean.toLowerCase().replace(/\.eth$/, '')
    : `${clean.slice(0, 6).toLowerCase()}_${clean.slice(-4).toLowerCase()}`;

  let profile = profilesStore.find(
    (p) =>
      p.username.toLowerCase() === username.toLowerCase() ||
      p.ethereumAddress?.toLowerCase() === clean.toLowerCase()
  );

  if (profile) {
    profile.claimed = true;
    if (!isEns) {
      profile.ethereumAddress = clean;
    }
    return profile;
  }

  profile = {
    id: String(profilesStore.length + 1),
    username,
    displayName: isEns ? clean : `${clean.slice(0, 6)}...${clean.slice(-4)}`,
    bio: `Verified Ethereum wallet profile (${clean}).`,
    ethereumAddress: isEns ? undefined : clean,
    claimed: true,
    followersCount: 1,
    followingCount: 0,
    postsCount: 0
  };
  profilesStore.unshift(profile);
  return profile;
}
