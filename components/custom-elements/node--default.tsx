import React from 'react';
import DynamicComponent from '../DynamicComponent';

type NodeProps = {
    title?: string;
    type?: string;
    created?: number | string;
    body?: string | string[];
    image?: {
        content: string;
    };
    sections?: {
        element: string;
        content: any;
    };
}

const Node: React.FC<NodeProps> = ({ 
    title, 
    type,
    created, 
    body, 
    image, 
    sections
}) => {
    return (
        <div className="node">
            {image && (
                <div dangerouslySetInnerHTML={{ __html: image.content }} />
            )}
            
            {body && (
                <div className="prose max-w-none [&_a]:text-blue-600" 
                    dangerouslySetInnerHTML={{ 
                        __html: Array.isArray(body) ? body.join('') : body 
                    }} 
                />
            )}
            
            {sections && (
                <div>
                    <DynamicComponent 
                        element={sections.element} 
                        content={sections} 
                    />
                </div>
            )}
        </div>
    );
};

export default Node;