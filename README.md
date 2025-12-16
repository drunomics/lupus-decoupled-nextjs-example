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
- **Menu support** - Main menu integrated in layout with support for nested items
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
