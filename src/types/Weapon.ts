export type Weapon = {
	uuid: string;
	displayName: string;
	themeUuid: string;
	contentTierUuid: string | null;
	displayIcon: string;
	levels: {
		uuid: string;
		displayName: string;
		levelItem: string | null;
		displayIcon: string;
		streamedVideo: string | null;
		assetPath: string;
	};
};
