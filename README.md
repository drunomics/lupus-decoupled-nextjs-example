# Lupus Decoupled Next.js Demo

## Try-it

[Launch it on Gitpod](https://gitpod.io/new/#DP_PROJECT_NAME=lupus_decoupled,DP_ISSUE_BRANCH=1.x,DP_PROJECT_TYPE=project_module,DP_MODULE_VERSION=1.x,DP_PATCH_FILE=,FRONTEND_REPOSITORY=https%3A%2F%2Fgithub.com%2Fdrunomics%2Flupus-decoupled-nextjs-demo,CUSTOM_ELEMENTS_VERSION=3.*,DP_INSTALL_PROFILE=standard/https://github.com/drunomics/lupus-decoupled-project/tree/main) with a Lupus Decoupled Drupal backend.

## Implementation status

### Supported features
- Rendering custom elements via components
- Rendering a tree of custom elements
- Forwarding /some-page requests to the backend and rendering results
- Breadcrumbs
- Metatags
- Messages
- Drupal error pages
- Drupal redirect support (301, 302, 303, 307, 308)
- **Cookie forwarding** - Authentication cookies are forwarded to Drupal for personalized content
- **Menu support** - Main menu integrated in layout with support for nested items
- **Header pass-through** - Drupal cache headers, language, and other headers properly forwarded
- **App Router support** - Full Next.js App Router compatibility with streaming and server components

### Not or not fully supported
- Drupal forms
- Frontend login
- Custom layouts
- Views (component needs to be ported)
- Drupal tabs (component needs to be ported)

## Development

### Gitpod testing options

When working on this template, things can be tested best on gitpod by modifying the launch link:

**Testing frontend repository branches**
Use the following link:

```
https://gitpod.io/new/#DP_PROJECT_NAME=lupus_decoupled,DP_ISSUE_BRANCH=1.x,DP_PROJECT_TYPE=project_module,DP_MODULE_VERSION=1.x,DP_PATCH_FILE=,FRONTEND_REPOSITORY=https%3A%2F%2Fgithub.com%2Fdrunomics%2Flupus-decoupled-nextjs-demo,FRONTEND_BRANCH=<<BRANCH>>,CUSTOM_ELEMENTS_VERSION=3.*,DP_INSTALL_PROFILE=standard/https://github.com/drunomics/lupus-decoupled-project/tree/main
```

## Try it online

### Option 1: Try it Online with Stackblitz

You can quickly try this project online using Stackblitz:

[Open in Stackblitz](https://stackblitz.com/github/remix-run/react-router/tree/main/examples/basic?file=README.md)

1. After launching the project, create a `.env` file in the root directory.
2. Paste the following environment variable into the `.env` file:

```bash
NEXT_PUBLIC_DRUPAL_BASE_URL="https://8080-drunomics-lupusdecouple-xeqrf6qqxj3.ws-eu116.gitpod.io"
```

3. Save the file and continue working with the project directly in Stackblitz.

### Option 2: Run Locally

To run the project on your local machine:

1. **Clone the Repository**:
   ```bash
   git clone git@github.com:drunomics/lupus-decoupled-nextjs-demo.git
   ```

2. **Create a `.env` File**:
   - If a `.env` file doesn't already exist in the root directory, create one.
   - Then, add the following environment variable:

   ```bash
   NEXT_PUBLIC_DRUPAL_BASE_URL="https://8080-drunomics-lupusdecouple-xeqrf6qqxj3.ws-eu116.gitpod.io"
   ```

3. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies:

```bash
npm install
```

4. **Run the Project**: Start the development server:

```bash
npm run dev
```

5. **View the Project**: Open your browser and navigate to `http://localhost:3000` to view the application

## Manual setup steps

For local setup you'll get some network error until base URLs are set right. To do so:

1. Set the Drupal base URL(`NEXT_PUBLIC_DRUPAL_BASE_URL`) in `env.file`, e.g. `https://drunomics-lupusdecouple-xeqrf6qqxj3.ws-eu116.gitpod.io/`
   When using a Drupal gitpod/DrupalPod as a backend, make sure to set your environment to "Shared" via the workspace options menu, as found in the dashhboard at https://gitpod.io. That way the frontend can connect to it.
2. Test it. Best add some content nodes and some menu-items pointing to them. /node/1 of the backend is available under /node/1 in the frontend. You should see some naked frontend with menus, breadcrumbs & basic node-content (body field) working.


## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Mock Mode for Development

You can run this project without a Drupal backend using mock mode. This is useful for:
- Development without backend access
- Testing and demos
- Learning the component structure

### Enabling Mock Mode

1. Create a `.env.local` file (or copy `.env.example`):
   ```bash
   cp .env.example .env.local
   ```

2. Set mock mode:
   ```bash
   NEXT_PUBLIC_USE_MOCK="true"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Available Mock Routes

The mock API provides several example pages:

- `/demo-first` - Simple article page
- `/ldp-example` - Complex channel page with teasers
- `/redirect-test` - Tests redirect functionality
- `/science` - Science channel page
- `/sport` - Sport channel page
- `/info` - Info channel page

### Mock API Endpoints

Mock data is served via Next.js API routes:
- `GET /api/mock/[...path]` - Page content
- `GET /api/mock/menu/[menuName]` - Menu items

You can extend the mock data by editing:
- `/app/api/mock/[...path]/route.ts` - Add more page routes
- `/app/api/mock/menu/[menuName]/route.ts` - Add more menus
- `/mockData.js` - Add more mock data structures

## API Documentation

### Data Fetching with Cookie Forwarding

This project implements complete cookie forwarding and header management inspired by [nuxtjs-drupal-ce](https://github.com/drunomics/nuxtjs-drupal-ce).

#### App Router (Recommended)

For Next.js App Router, use the simplified helpers:

```typescript
import { headers } from 'next/headers';
import { fetchPageForAppRouter, fetchMenuForAppRouter } from '@/lib/drupalClient';

// Fetch page with automatic cookie forwarding and redirect handling
export default async function Page() {
  const headersList = await headers();
  const pageData = await fetchPageForAppRouter('/node/1', headersList);

  // Redirects are handled automatically via Next.js redirect()
  // Cookies are automatically forwarded to Drupal

  return <div>{pageData.title}</div>;
}

// Fetch menu
const mainMenu = await fetchMenuForAppRouter('main', headersList);
```

#### Pages Router (Legacy)

For Pages Router (moved to `pages-legacy/`):

```typescript
import { fetchPage, fetchMenu } from '@/lib/drupalClient';

export async function getServerSideProps(context) {
  const pageData = await fetchPage(
    context.resolvedUrl,
    context.req.headers,
    context.res
  );

  return { props: { pageData } };
}
```

### Headers Forwarded

**Request headers forwarded to Drupal:**
- `cookie` - For authentication and personalization
- `authorization` - For API authentication
- `x-csrf-token` - For CSRF protection
- `accept-language` - For content language negotiation

**Response headers passed back to client:**
- `cache-control` - Caching directives
- `content-language` - Content language
- `set-cookie` - Session cookies
- `x-drupal-cache` - Drupal cache status
- `x-drupal-dynamic-cache` - Drupal dynamic cache status
- `etag` - Cache validation
- `vary` - Vary header for caching

### Redirect Handling

The implementation supports all HTTP redirect status codes:
- **301** - Permanent redirect (with replace)
- **302** - Temporary redirect
- **303** - See Other
- **307** - Temporary redirect (preserves method)
- **308** - Permanent redirect (preserves method, with replace)

Redirects are handled server-side when possible, client-side otherwise.

### Menu Integration

Menus are fetched with cookie forwarding in the root layout:

```typescript
// app/layout.tsx
const mainMenu = await fetchMenuForAppRouter('main', headersList);
```

The `Menu` component supports:
- Nested menu items (configurable depth)
- Custom styling via className props
- Automatic active state handling
- Responsive design

### Custom Configuration

You can customize header forwarding:

```typescript
const pageData = await fetchPage(path, headers, response, {
  proxyHeaders: ['cookie', 'authorization', 'custom-header'],
  passThroughHeaders: ['cache-control', 'set-cookie', 'custom-response-header']
});
```
