// RichTextEditor.js
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import './RichTextEditor.css'

function RichTextEditor({ content, onContentChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    class: 'tiptap-link',
                },
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            const updatedHTML = editor.getHTML();
            onContentChange(updatedHTML);
        },
    });

    const handleAddLink = () => {
        let url = prompt('Enter the URL');
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`;
        }

        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const handleImageUploadFromFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                editor.chain().focus().setImage({ src: reader.result }).run();
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="rich-text-editor">
            <h4>Toolbar</h4>
            <div className="toolbar">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor?.can().chain().focus().toggleBold().run()}
                >
                    B
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor?.can().chain().focus().toggleItalic().run()}
                >
                    I
                </button>
                <button onClick={handleAddLink}>Link</button>
                <button
                    onClick={() => document.getElementById('image-upload').click()}
                >
                    Image
                </button>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUploadFromFile}
                />
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}

export default RichTextEditor;
