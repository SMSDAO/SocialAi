/**
 * @file index.ts
 * @description Shared types and ABIs
 * @module shared
 */

/**
 * Common type definitions for the SocialAi system
 */
export interface User {
    id: string;
    farcaster_id?: number;
    ethereum_address?: string;
    ens_name?: string;
}

export interface Profile {
    id: string;
    user_id: string;
    username: string;
    display_name?: string;
    bio?: string;
    claimed: boolean;
    verified: boolean;
}

export interface Claim {
    id: string;
    user_id: string;
    profile_id: string;
    claim_type: string;
    claim_value: string;
    verified: boolean;
}

/**
 * Contract ABIs will be exported here
 */
export const ContractABIs = {
    // ABIs will be added here
};

export default { User, Profile, Claim, ContractABIs };
