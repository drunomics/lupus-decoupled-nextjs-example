type DrupalMarkupProps = {
    content: string;
}

export default function DrupalMarkup({ content }: DrupalMarkupProps) {
    return (
        <div 
            className="drupal-markup"
            dangerouslySetInnerHTML={{ __html: content || '' }}
        />
    );
}
