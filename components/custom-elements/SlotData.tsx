type SlotDataProps = {
    content: string | string[];
    className?: string;
}

export default function SlotData({ content, className }: SlotDataProps) {
    const html = Array.isArray(content) ? content.join('') : content;

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
