const requireComponent = require.context('./custom-elements', true, /\.(jsx|tsx)$/);

const components = {};

// Register all components
requireComponent.keys().forEach((fileName) => {
    const componentName = fileName
        .replace(/^\.\//, '')
        .replace(/\.(jsx|tsx)$/, '');
    
    // Register the component with its exact name
    components[componentName] = requireComponent(fileName).default;
});

export default components;