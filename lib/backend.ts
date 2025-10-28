// import createFetchClient from 'openapi-fetch';
// import createClient from 'openapi-react-query';

// import type { paths } from './api';
// import { BaseErrorResponse } from './common';

// // This is the result of the last optimized error management defined in the backend
// export type FetchErrorResponse = {
//     statusCode: number;
//     message: string;
//     error: unknown;
//     id?: string;
//     category?: string;
//     severity?: string;
//     timestamp?: string;
//     path?: string;
//     method?: string;
// };

// export type FetchError = typeof Error & FetchErrorResponse;

// export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// if (!BACKEND_URL) {
//     throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not set');
// }

// export const backendUrl = (baseUrl: string, version?: string, endpoint?: string) => {
//     if (baseUrl.endsWith('/')) {
//         baseUrl = baseUrl.slice(0, -1);
//     }
//     if (version && version.startsWith('/')) {
//         version = version.slice(1);
//     }

//     if (endpoint && endpoint.startsWith('/')) {
//         endpoint = endpoint.slice(1);
//     }

//     const base = version ? `${baseUrl}/${version}` : baseUrl;
//     const complete = endpoint ? `${base}/${endpoint}` : base;
//     return complete;
// };

// /**
//  * Custom fetch implementation that includes credentials and handles errors
//  */
// export const enhancedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
//     let response: Response;
//     try {
//         response = await fetch(input, {
//             ...init,
//             // credentials: 'include',
//         });

//         // if (response.status === 403 || response.status === 401) {
//         //     const error = await response.json();
//         //     //throw error;
//         // }
//     } catch (e) {
//         throw e;
//         // throw {
//         //     statusCode: 503,
//         //     message: 'Servidor no disponible',
//         //     error: e,
//         // };
//     }

//     return response;
// };

// /**
//  * Client for connecting with the backend
//  */
// const fetchClient = createFetchClient<paths>({
//     baseUrl: backendUrl(BACKEND_URL),
//     fetch: enhancedFetch,
// });

// export const backend = createClient(fetchClient);