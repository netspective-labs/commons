export interface OpenGraphMedia {
  url: string;
  width: number;
  height: number;
}

export type OpenGraphVideo = OpenGraphMedia & {
  type: string;
};

export type OpenGraphImage = OpenGraphMedia & {
  type: string;
};

export interface OpenGraphMusicSong {
  url: string;
  track: number;
  disc: number;
}

export type OpenGraphTwitterImage = OpenGraphMedia & {
  alt?: string;
};

export type OpenGraphTwitterPlayer = OpenGraphMedia & {
  stream?: string;
};

export type OpenGraphCustom = {
  [key in OpenGraphField]?: string | string[];
} & {
  charset?: string;
};

export type OpenGraph = {
  ogTitle?: string;
  ogType?: string;
  ogUrl?: string;
  ogDescription?: string;
  ogImage?: OpenGraphImage[];
  ogVideo?: OpenGraphVideo[];
  charset?: string;
  twitterImage?: OpenGraphTwitterImage[];
  twitterPlayer?: OpenGraphTwitterPlayer[];
  musicSong?: OpenGraphMusicSong[];
  response?: Response;
} & Omit<
  OpenGraphCustom,
  "ogImage" | "ogVideo" | "twitterImage" | "twitterPlayer" | "musicSong"
>;

export type OpenGraphField =
  | "musicAlbum"
  | "musicAlbumDisc"
  | "musicAlbumTrack"
  | "musicCreator"
  | "musicDuration"
  | "musicMusician"
  | "musicReleaseDate"
  | "musicSong"
  | "musicSongDisc"
  | "musicSongTrack"
  | "ogAudio"
  | "ogAudioSecureURL"
  | "ogAudioType"
  | "ogAudioURL"
  | "ogAvailability"
  | "ogDescription"
  | "ogDeterminer"
  | "ogImage"
  | "ogImageHeight"
  | "ogImageSecureURL"
  | "ogImageType"
  | "ogImageURL"
  | "ogImageWidth"
  | "ogLocale"
  | "ogLocaleAlternate"
  | "ogPriceAmount"
  | "ogPriceCurrency"
  | "ogProductAvailability"
  | "ogProductCondition"
  | "ogProductPriceAmount"
  | "ogProductPriceCurrency"
  | "ogProductRetailerItemId"
  | "ogSiteName"
  | "ogTitle"
  | "ogType"
  | "ogUrl"
  | "ogVideo"
  | "ogVideo"
  | "ogVideoHeight"
  | "ogVideoSecureURL"
  | "ogVideoType"
  | "ogVideoWidth"
  | "twitterAppIdGooglePlay"
  | "twitterAppIdiPad"
  | "twitterAppIdiPhone"
  | "twitterAppNameGooglePlay"
  | "twitterAppNameiPad"
  | "twitterAppNameiPhone"
  | "twitterAppUrlGooglePlay"
  | "twitterAppUrliPad"
  | "twitterAppUrliPhone"
  | "twitterCard"
  | "twitterCreator"
  | "twitterCreatorId"
  | "twitterDescription"
  | "twitterImage"
  | "twitterImageAlt"
  | "twitterImageHeight"
  | "twitterImageSrc"
  | "twitterImageWidth"
  | "twitterPlayer"
  | "twitterPlayerHeight"
  | "twitterPlayerStream"
  | "twitterPlayerWidth"
  | "twitterSite"
  | "twitterSiteId"
  | "twitterTitle"
  | "videoActor"
  | "videoActorRole"
  | "videoDirector"
  | "videoWriter"
  | "videoDuration"
  | "videoReleaseDate"
  | "videoTag"
  | "videoSeries"
  | "articlePublishedTime"
  | "articleModifiedTime"
  | "articleExpirationTime"
  | "articleAuthor"
  | "articlePublishedTime"
  | "articleTag"
  | "bookAuthor"
  | "bookTag"
  | "bookIsbn"
  | "bookReleaseDate"
  | "profileFirstName"
  | "profileLastName"
  | "profileUsername"
  | "profileGender"
  | "author"
  | "keywords"
  | "description"
  | "copyright"
  | "applicationName";
