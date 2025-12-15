import React from 'react';
import SlotData from './SlotData';

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
            {title && <h2>Node: {title}</h2>}
            
            {image && (
                <SlotData content={image.content} />
            )}
            
            {body && (
                <SlotData
                    content={body}
                    className="prose max-w-none [&_a]:text-blue-600"
                />
            )}
            
            {sections && (
                <SlotData content={sections.content} />
            )}
        </div>
    );
};

export default Node;