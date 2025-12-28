"use client";

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import {
    Bold, Italic, List, ListOrdered, Heading1, Heading2,
    Quote, Undo, Redo, ImageIcon, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';

// Custom Image extension to support width
const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                renderHTML: attributes => {
                    return {
                        width: attributes.width,
                        style: `width: ${attributes.width}; height: auto;`
                    };
                },
                parseHTML: element => element.getAttribute('width') || element.style.width,
            },
        };
    },
});

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            CustomImage,
            BubbleMenuExtension,
        ],
        content,
        onUpdate: ({ editor }: { editor: Editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[200px] p-4 focus:outline-none [&_img]:rounded-lg',
            },
        },
        immediatelyRender: false,
    });

    if (!editor) {
        return null;
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.url) {
                editor.chain().focus().setImage({ src: data.url }).run();
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
            // Reset the input so the same file can be uploaded again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const addImage = () => {
        fileInputRef.current?.click();
    };

    const setImageWidth = (width: string) => {
        editor.chain().focus().updateAttributes('image', { width }).run();
    };

    return (
        <div className="border border-white/10 rounded-lg overflow-hidden bg-white/5 relative">
            {/* Bubble Menu for Image Resizing */}
            {editor && (
                <BubbleMenu
                    editor={editor}

                    shouldShow={({ editor }) => editor.isActive('image')}
                    className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-1 flex gap-1 shadow-xl"
                >
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageWidth('25%')}
                        className={`text-xs h-7 text-white hover:bg-white/10 ${editor.getAttributes('image').width === '25%' ? 'bg-white/20' : ''}`}
                    >
                        25%
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageWidth('50%')}
                        className={`text-xs h-7 text-white hover:bg-white/10 ${editor.getAttributes('image').width === '50%' ? 'bg-white/20' : ''}`}
                    >
                        50%
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageWidth('75%')}
                        className={`text-xs h-7 text-white hover:bg-white/10 ${editor.getAttributes('image').width === '75%' ? 'bg-white/20' : ''}`}
                    >
                        75%
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageWidth('100%')}
                        className={`text-xs h-7 text-white hover:bg-white/10 ${editor.getAttributes('image').width === '100%' ? 'bg-white/20' : ''}`}
                    >
                        100%
                    </Button>
                </BubbleMenu>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/5">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-white/10' : ''}
                >
                    <Bold className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-white/10' : ''}
                >
                    <Italic className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-white/10' : ''}
                >
                    <Heading1 className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-white/10' : ''}
                >
                    <Heading2 className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-white/10' : ''}
                >
                    <List className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-white/10' : ''}
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-white/10' : ''}
                >
                    <Quote className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={addImage}
                    disabled={uploading}
                    title="Upload image"
                >
                    {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    ) : (
                        <ImageIcon className="w-4 h-4" />
                    )}
                </Button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="w-4 h-4" />
                </Button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
            />
        </div>
    );
}
