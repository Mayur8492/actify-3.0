import React, { useEffect, useState } from 'react';
import { usePageStore } from '../store/usePageStore';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { useSocketStore } from '../store/useSocketStore';
import { FileText, Plus, Save, Trash2 } from 'lucide-react';
import TiptapEditor from '../components/TiptapEditor';

const Pages = () => {
  const { pages, activePage, fetchPages, createPage, setActivePage, updatePage, deletePage } = usePageStore();
  const { activeWorkspace } = useWorkspaceStore();
  const { socket } = useSocketStore();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  // Socket listener for page updates
  useEffect(() => {
    if (!socket || !activePage) return;

    const handlePageUpdate = (updatedPage) => {
      if (updatedPage._id === activePage._id) {
        setTitle(updatedPage.title);
        setContent(updatedPage.content || '');
      }
    };

    socket.on('page_updated', handlePageUpdate);
    return () => socket.off('page_updated', handlePageUpdate);
  }, [socket, activePage]);

  useEffect(() => {
    if (activeWorkspace) {
      fetchPages(activeWorkspace._id);
    }
  }, [activeWorkspace, fetchPages]);

  useEffect(() => {
    if (activePage) {
      setTitle(activePage.title);
      setContent(activePage.content || '');
    } else {
      setTitle('');
      setContent('');
    }
  }, [activePage]);

  const handleCreatePage = async () => {
    if (!activeWorkspace) return;
    const newPage = await createPage('Untitled Page', activeWorkspace._id);
    if (newPage) setActivePage(newPage);
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);
    // Real-time broadcast without saving to DB immediately
    if (socket && activePage) {
      socket.emit('update_page', { ...activePage, title, content: newContent });
    }
  };

  const handleSave = async () => {
    if (!activePage) return;
    await updatePage(activePage._id, { title, content });
    if (socket) {
      socket.emit('update_page', { ...activePage, title, content });
    }
  };

  if (!activeWorkspace) {
    return <div className="text-textSecondary">Please select a workspace first.</div>;
  }

  return (
    <div className="flex h-full border border-surface rounded-2xl overflow-hidden bg-card">
      {/* Sidebar / Page Tree */}
      <div className="w-64 bg-surface border-r border-card flex flex-col">
        <div className="p-4 border-b border-card flex justify-between items-center bg-card">
          <h3 className="font-semibold text-textPrimary text-sm uppercase tracking-wider">Pages</h3>
          <button 
            onClick={handleCreatePage}
            className="text-textSecondary hover:text-primary transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {pages.map((page) => (
            <div 
              key={page._id}
              onClick={() => setActivePage(page)}
              className={`flex items-center px-4 py-2 cursor-pointer text-sm transition-colors ${
                activePage?._id === page._id 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-textSecondary hover:bg-card hover:text-textPrimary'
              }`}
            >
              <FileText className="h-4 w-4 mr-2 opacity-70" />
              <span className="truncate">{page.title}</span>
            </div>
          ))}
          {pages.length === 0 && (
            <div className="px-4 py-8 text-center text-xs text-textSecondary">
              No pages yet. Click + to create one.
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col bg-background relative">
        {activePage ? (
          <>
            <div className="h-16 border-b border-surface flex items-center justify-between px-8 bg-card">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page Title"
                className="bg-transparent border-none outline-none text-xl font-bold text-textPrimary w-full"
              />
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSave}
                  className="flex items-center text-sm font-medium text-textSecondary hover:text-primary transition-colors bg-surface px-3 py-1.5 rounded-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button 
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this page?')) {
                      await deletePage(activePage._id);
                    }
                  }}
                  className="flex items-center text-sm font-medium text-danger hover:bg-danger/10 transition-colors bg-surface px-3 py-1.5 rounded-lg"
                  title="Delete Page"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
              <TiptapEditor 
                content={content} 
                onChange={handleContentChange} 
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-textSecondary">
            Select a page or create a new one
          </div>
        )}
      </div>
    </div>
  );
};

export default Pages;
