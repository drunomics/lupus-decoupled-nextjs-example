import axios, { AxiosError } from "axios"
import https from 'https';
import { PageData, DrupalMenuItem, MenuItem, ErrorResponse } from './types';

const drupalBaseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL;
const ceApiEndpoint = '/ce-api'

// For development: Allow self-signed certificates (like GitHub Codespaces)
// WARNING: Do not use in production!
const rejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0';

// Re-export types for backwards compatibility
export type { PageData, MenuItem } from './types';

export const drupalClient = axios.create({
    baseURL: `${drupalBaseUrl}${ceApiEndpoint}`,
    withCredentials: true,
    timeout: 30000,
    // Allow self-signed certificates in development
    httpsAgent: new https.Agent({
        rejectUnauthorized: rejectUnauthorized
    })
});

function handleError(error: AxiosError): ErrorResponse {
    if (error.response) {
        const responseData = error.response.data as PageData;
        responseData.statusCode = error.response.status;

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

// Transform Drupal menu items to our format
function transformDrupalMenuItem(item: DrupalMenuItem): MenuItem {
    return {
        title: item.title,
        url: item.relative || item.alias || item.uri || '/',
        children: item.children ? item.children.map(transformDrupalMenuItem) : []
    };
}

/**
 * Fetch menu from Drupal
 */
export async function fetchMenu(): Promise<MenuItem[]> {
    try {
        const response = await drupalClient.get<DrupalMenuItem[]>('/api/menu_items/main');

        if (Array.isArray(response.data)) {
            return response.data.map(transformDrupalMenuItem);
        }

        return [];
    } catch (error) {
        console.error('Failed to fetch menu:', error);
        return [];
    }
}

/**
 * Fetch page data from Drupal
 * @param path Drupal path
 */
export async function fetchPage(
    path: string,
): Promise<PageData> {
    try {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;

        const response = await drupalClient.get<PageData>(cleanPath);

        validateResponse(response.data);

        // Handle redirects using Next.js redirect
        if (response.data.redirect) {
            const { redirect } = await import('next/navigation');
            redirect(response.data.redirect.url);
        }

        response.data.statusCode = response.status;
        return response.data;
    } catch (error) {
        const errorResponse = handleError(error as AxiosError);
        if (errorResponse.data) {
            return errorResponse.data;
        }
        throw errorResponse;
    }
}

