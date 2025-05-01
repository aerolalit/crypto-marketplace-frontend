export enum SocialMediaType {
    TWITTER = 'TWITTER',
    FACEBOOK = 'FACEBOOK',
    INSTAGRAM = 'INSTAGRAM',
    LINKEDIN = 'LINKEDIN',
    GITHUB = 'GITHUB',
    DISCORD = 'DISCORD',
    TELEGRAM = 'TELEGRAM'
}

export interface SocialMediaLinkDto {
    name: SocialMediaType;
    url: string;
}

export interface UpdateUserProfileDto {
    bio?: string;
    links?: SocialMediaLinkDto[];
}

export interface UserProfile {
    id: string;
    bio?: string;
    links?: SocialMediaLinkDto[];
    createdAt: string;
    updatedAt: string;
} 