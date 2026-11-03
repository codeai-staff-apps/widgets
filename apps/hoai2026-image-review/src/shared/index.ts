/**
 * Primitives shared by every widget app. They are copied into the app by
 * `cp -r template apps/<app-id>`; apps never import across app boundaries.
 */
export {LiveAnnouncerProvider, useAnnounce} from './LiveAnnouncer';
