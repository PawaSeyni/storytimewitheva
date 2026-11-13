// What a failed hydration looks like in the production (minified) React 18 build:
//   #418  Hydration failed because the initial UI does not match what was rendered on the server
//   #421  A Suspense boundary received an update before it finished hydrating (client-rendered)
//   #422  There was an error while hydrating this Suspense boundary. Switched to client rendering.
//   #423  There was an error while hydrating ... the entire root will switch to client rendering
//   #425  Text content does not match server-rendered HTML
// The unminified wordings are kept too, so the check still reads correctly if a
// dev build ever ends up in dist/.
export const HYDRATION_ERROR = /Minified React error #(418|421|422|423|425)\b|Hydration failed|did not match/;

export const isHydrationError = text => HYDRATION_ERROR.test(String(text));
