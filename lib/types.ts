export type PageData = {
    title?: string;
    metatags?: {
        meta: { name: string; content: string; }[];
        link: { rel: string; href: string; }[];
        jsonld?: Record<string, any> | Record<string, any>[];
    };
    messages?: string[] | Record<string, any>;
    breadcrumbs?: { text: string; url: string; }[];
    content?: {
        element: string;
        [key: string]: any;
    };
    statusCode?: number;
    redirect?: {
        url: string;
        statusCode: number;
        external: boolean;
    };
}

// Drupal menu item structure (raw format from Drupal API)
export type DrupalMenuItem = {
    key: string;
    title: string;
    description: string | null;
    uri: string;
    alias: string;
    external: boolean;
    absolute: string;
    relative: string;
    existing: boolean;
    weight: string;
    expanded: boolean;
    enabled: boolean;
    uuid: string | null;
    options: any[];
    children?: DrupalMenuItem[];
}

// Normalized menu item structure for frontend use
export type MenuItem = {
    title: string;
    url: string;
    children?: MenuItem[];
}

export type ErrorResponse = {
    statusCode: number;
    message: string;
    data?: PageData;
}
