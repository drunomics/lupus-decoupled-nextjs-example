import React from 'react';
import DynamicComponent from '../DynamicComponent';
import SlotData from './SlotData';

/** 
 * Copy of the default node--default.tsx file, slightly adapted
 * to show it'S take only for node-page-full elements.
 */

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
            {title && <h2>Article: {title}</h2>}
            
            {image && (
                <div dangerouslySetInnerHTML={{ __html: image.content }} />
            )}
            
            {body && (
                <SlotData
                    content={body}
                    className="prose max-w-none [&_a]:text-blue-600"
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