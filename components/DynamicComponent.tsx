import dynamic from "next/dynamic";
import components from "./componentRegistery";

type DynamicComponentProps = {
    element?: string;
    content: { [key: string]: any };
}

function findComponent(elementName: string): string | null {
    const name = elementName.toLowerCase();
    
    // Try exact match
    if (components[name]) {
        return name;
    }
    
    // Try fallbacks by progressively removing parts
    const parts = name.split('-');
    
    while (parts.length >= 1) {
        const defaultComponent = `${parts[0]}--default`;
        if (components[defaultComponent]) {
            return defaultComponent;
        }
        parts.pop();
    }
    
    return null;
}

export default function DynamicComponent({ element, content }: DynamicComponentProps) {
    if (!element) {
        console.warn('DynamicComponent: element prop is missing or undefined');
        return <div>Component element is missing</div>;
    }

    const componentName = findComponent(element);

    if (!componentName) {
        console.warn(`No component found for "${element}" or any of its fallbacks. Available components:`, Object.keys(components));
        return <div>Component "{element}" not found</div>;
    }

    const ComponentToRender = components[componentName];
    const DynamicComponentToRender = dynamic(() => Promise.resolve(ComponentToRender));

    return <DynamicComponentToRender {...content} />;
}