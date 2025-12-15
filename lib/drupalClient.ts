import axios, { AxiosResponse, AxiosError } from "axios"
import { ServerResponse } from 'http';
import https from 'https';
import { PageData, DrupalMenuItem, MenuItem, ErrorResponse } from './types';

const drupalBaseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;
const ceApiEndpoint = '/ce-api'

// For development: Allow self-signed certificates (like GitHub Codespaces)
// WARNING: Do not use in production!
const rejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0';

// Re-export types for backwards compatibility
export type { PageData, MenuItem } from './types';

// Headers to forward from client requests to Drupal
const DEFAULT_FETCH_PROXY_HEADERS = [
    'cookie',
    'authorization',
    'x-csrf-token',
    'accept-language'
];

// Response headers to pass through from Drupal backend to the client
const DEFAULT_PASS_THROUGH_HEADERS = [
    'cache-control',
    'content-language',
    'set-cookie',
    'x-drupal-cache',
    'x-drupal-dynamic-cache',
    'etag',
    'vary'
];

export const drupalClient = axios.create({
    baseURL: `${drupalBaseUrl}${ceApiEndpoint}`,
    withCredentials: true,
    timeout: 30000,
    // Allow self-signed certificates in development
    httpsAgent: new https.Agent({
        rejectUnauthorized: rejectUnauthorized
    })
});

function handleError(error: AxiosError, serverResponse?: ServerResponse): ErrorResponse {
    if (error.response) {
        const responseData = error.response.data as PageData;
        responseData.statusCode = error.response.status;

        if (serverResponse) {
            serverResponse.statusCode = error.response.status;
            // Pass through headers from error responses too
            setResponseHeaders(error.response, serverResponse);
        }

        return {
            statusCode: error.response.status,
            message: error.message,
            data: responseData
        };
    } else if (error.request) {
        return {
            statusCode: 503,
            message: 'Service unavailable - could not reach Drupal backend'
        };
    } else {
        return {
            statusCode: 500,
            message: error.message || 'Internal server error'
        };
    }
}

function validateResponse(data: PageData): void {
    if (!(data.title || data.content) && !data.redirect) {
        throw {
            statusCode: 422,
            message: 'Malformed API response. Please make sure to install Custom Elements renderer: https://www.drupal.org/project/lupus_ce_renderer'
        };
    }
}

function handleRedirect(data: PageData, serverResponse?: ServerResponse): boolean {
    if (!data.redirect) return false;

    const { url, statusCode = 302, external = false } = data.redirect;

    if (serverResponse) {
        // Server-side redirect
        // Validate redirect status code
        const validRedirectCode = [301, 302, 303, 307, 308].includes(statusCode)
            ? statusCode
            : 302;

        serverResponse.writeHead(validRedirectCode, {
            Location: url
        });
        serverResponse.end();
        return true;
    } else {
        // Client-side redirect - handled by the page component
        return true;
    }
}

function extractRequestHeaders(
    incomingHeaders: Record<string, string> = {},
    proxyHeaders: string[] = DEFAULT_FETCH_PROXY_HEADERS
): Record<string, string> {
    return Object.fromEntries(
        proxyHeaders
            .map(header => [header.toLowerCase(), incomingHeaders[header.toLowerCase()]])
            .filter(([_, value]) => value !== undefined)
    );
}

function setResponseHeaders(
    response: AxiosResponse,
    serverResponse: ServerResponse,
    passThroughHeaders: string[] = DEFAULT_PASS_THROUGH_HEADERS
): void {
    passThroughHeaders.forEach(header => {
        const value = response.headers[header.toLowerCase()];
        if (value) {
            serverResponse.setHeader(header, value);
        }
    });
}

// Transform Drupal menu items to our format
function transformDrupalMenuItem(item: DrupalMenuItem): MenuItem {
    return {
        title: item.title,
        url: item.relative || item.alias || item.uri || '/',
        children: item.children ? item.children.map(transformDrupalMenuItem) : []
    };
}

export async function fetchMenu(
    incomingHeaders?: Record<string, string>,
    serverResponse?: ServerResponse,
    options: {
        proxyHeaders?: string[];
        passThroughHeaders?: string[];
    } = {}
): Promise<MenuItem[]> {
    try {
        const headers = extractRequestHeaders(
            incomingHeaders,
            options.proxyHeaders
        );

        const response = await drupalClient.get<DrupalMenuItem[]>('/api/menu_items/main', { headers });

        if (serverResponse) {
            setResponseHeaders(response, serverResponse, options.passThroughHeaders);
        }

        // Transform Drupal menu items to our format
        if (Array.isArray(response.data)) {
            return response.data.map(transformDrupalMenuItem);
        }

        return [];
    } catch (error) {
        // Return empty array on error instead of throwing
        console.error('Failed to fetch menu:', error);
        return [];
    }
}

export async function fetchPage(
    path: string,
    incomingHeaders?: Record<string, string>,
    serverResponse?: ServerResponse,
    options: {
        proxyHeaders?: string[];
        passThroughHeaders?: string[];
    } = {}
): Promise<PageData> {
    try {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        const headers = extractRequestHeaders(
            incomingHeaders,
            options.proxyHeaders
        );

        const response = await drupalClient.get<PageData>(cleanPath, { headers });

        if (serverResponse) {
            setResponseHeaders(response, serverResponse, options.passThroughHeaders);
        }

        validateResponse(response.data);

        // Handle redirects
        if (response.data.redirect) {
            const isRedirecting = handleRedirect(response.data, serverResponse);
            if (isRedirecting) {
                return response.data; // Let the page component handle client-side redirects
            }
        }

        response.data.statusCode = response.status;
        return response.data;
    } catch (error) {
        const errorResponse = handleError(error as AxiosError, serverResponse);
        if (errorResponse.data) {
            return errorResponse.data;
        }
        throw errorResponse;
    }
}

// Next.js App Router helpers
// Convert Next.js Headers object to plain object
export function convertNextHeaders(headers: Headers): Record<string, string> {
    const headersObj: Record<string, string> = {};
    headers.forEach((value, key) => {
        headersObj[key.toLowerCase()] = value;
    });
    return headersObj;
}

// Simplified API for App Router - handles redirects via Next.js redirect()
export async function fetchPageForAppRouter(
    path: string,
    headers?: Headers,
    options?: {
        proxyHeaders?: string[];
    }
): Promise<PageData> {
    const headersObj = headers ? convertNextHeaders(headers) : undefined;
    const pageData = await fetchPage(path, headersObj, undefined, options);

    // For App Router, handle redirects using Next.js redirect function
    if (pageData.redirect) {
        const { redirect } = await import('next/navigation');
        const redirectType = [301, 308].includes(pageData.redirect.statusCode)
            ? 'replace' as const
            : 'push' as const;

        redirect(pageData.redirect.url, redirectType);
    }

    return pageData;
}

// Simplified API for App Router menus
export async function fetchMenuForAppRouter(
    menuName: string = 'main',
    headers?: Headers,
    options?: {
        proxyHeaders?: string[];
    }
): Promise<MenuItem[]> {
    const headersObj = headers ? convertNextHeaders(headers) : undefined;
    return fetchMenu(headersObj, undefined, options);
}