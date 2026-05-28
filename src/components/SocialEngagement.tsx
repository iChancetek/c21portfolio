'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Smile, Star, Send, Heart, Repeat2, Edit2, Trash2, Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useUser, useFirestore } from '@/firebase/provider';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface SocialEngagementProps {
  platformName?: string;
  className?: string;
}

interface Comment {
  id: string;
  name: string;
  text: string;
  replies?: Comment[];
  userId?: string;
  photoUrl?: string | null;
}

const CUSTOM_REACTIONS = [
  { icon: '🌟', label: 'Excellent' },
  { icon: '🧠', label: 'Brilliant' },
  { icon: '🔥', label: 'Phenomenal' },
  { icon: '❤️', label: 'Love' }
];

function CommentItem({ 
  comment, 
  onReplyClick,
  onEditSubmit,
  onDeleteClick,
  currentUserUid
}: { 
  comment: Comment; 
  onReplyClick: (id: string, handle: string) => void;
  onEditSubmit?: (id: string, newText: string) => void;
  onDeleteClick?: (id: string) => void;
  currentUserUid?: string | null;
}) {
  const [reaction, setReaction] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const isOwner = currentUserUid && comment.userId === currentUserUid;

  const handleRepost = () => {
    setIsReposted(!isReposted);
    setRepostCount(prev => isReposted ? prev - 1 : prev + 1);
  };

  const handleReply = () => {
    const handle = `@${comment.name.toLowerCase().replace(/\s/g, '')} `;
    onReplyClick(comment.id, handle);
  };

  const handleEditSave = () => {
    onEditSubmit?.(comment.id, editText);
    setIsEditing(false);
  };

  const handleListen = () => {
    // Basic TTS using Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any currently playing speech
      const utterance = new SpeechSynthesisUtterance(comment.text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-3 py-3 relative">
        <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
          {comment.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="font-semibold text-sm text-foreground truncate">{comment.name}</span>
            <span className="text-xs text-muted-foreground truncate">@{comment.name.toLowerCase().replace(/\s/g, '')}</span>
            <span className="text-xs text-muted-foreground">· 2h</span>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2">
              <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDeleteClick?.(comment.id)} className="text-xs text-muted-foreground hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        
        {isEditing ? (
           <div className="flex flex-col gap-2 mb-2 mt-1">
             <textarea 
               value={editText} 
               onChange={e => setEditText(e.target.value)}
               className="w-full min-h-[60px] text-sm bg-transparent border border-border/20 rounded-md focus:ring-0 p-2 text-foreground custom-scrollbar"
             />
             <div className="flex justify-end gap-2">
               <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
               <Button size="sm" onClick={handleEditSave}>Save</Button>
             </div>
           </div>
        ) : (
           <p className="text-sm text-foreground/90 mb-2 whitespace-pre-wrap">{comment.text}</p>
        )}
        <div className="flex items-center gap-6 mt-1 text-muted-foreground">
          <button 
            onClick={handleReply}
            className="flex items-center gap-1.5 text-xs hover:text-primary transition-colors group"
          >
            <div className="p-1.5 rounded-full group-hover:bg-primary/10 transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
            </div>
            0
          </button>
          
          <button 
            onClick={handleRepost}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors group",
              isReposted ? "text-green-500" : "hover:text-green-500"
            )}
          >
            <div className={cn("p-1.5 rounded-full transition-colors", isReposted ? "bg-green-500/10" : "group-hover:bg-green-500/10")}>
              <Repeat2 className="w-3.5 h-3.5" />
            </div>
            {repostCount}
          </button>

          <button 
            onClick={handleListen}
            className="flex items-center gap-1.5 text-xs hover:text-blue-500 transition-colors group"
            title="Listen to comment (TTS)"
          >
            <div className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
          </button>

          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowEmojis(true)}
            onMouseLeave={() => setShowEmojis(false)}
          >
            <button 
              onClick={() => setReaction(reaction ? null : CUSTOM_REACTIONS[3].icon)}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors group",
                reaction ? "text-red-500" : "hover:text-red-500"
              )}
            >
              <div className={cn("p-1.5 rounded-full transition-colors", reaction ? "bg-red-500/10" : "group-hover:bg-red-500/10")}>
                <Heart className={cn("w-3.5 h-3.5", reaction && "fill-current")} />
              </div>
              {reaction ? (
                <span className="font-medium flex items-center gap-1">
                  {CUSTOM_REACTIONS.find(e => e.icon === reaction)?.icon} {CUSTOM_REACTIONS.find(e => e.icon === reaction)?.label}
                </span>
              ) : (
                <span>React</span>
              )}
            </button>
            <AnimatePresence>
              {showEmojis && (
                <motion.div 
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute left-0 bottom-full mb-1 bg-background border border-border/50 rounded-lg shadow-xl flex flex-col p-1 z-50 backdrop-blur-xl min-w-[140px]"
                >
                  {CUSTOM_REACTIONS.map(e => (
                    <button
                      key={e.label}
                      onClick={() => {
                        setReaction(reaction === e.icon ? null : e.icon);
                        setShowEmojis(false);
                      }}
                      className="text-xs hover:bg-primary/10 transition-colors p-2 rounded-md flex items-center gap-2 text-left font-medium text-foreground"
                    >
                      <span className="text-base">{e.icon}</span> {e.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
      
      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-5 pl-4 border-l-2 border-border/10 flex flex-col gap-0 mt-1 mb-2">
          {comment.replies.map(reply => (
             <CommentItem 
               key={reply.id} 
               comment={reply} 
               onReplyClick={onReplyClick}
               onEditSubmit={onEditSubmit}
               onDeleteClick={onDeleteClick}
               currentUserUid={currentUserUid}
             />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SocialEngagement({ platformName, className }: SocialEngagementProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const docId = platformName || 'general';

  const [isMainReposted, setIsMainReposted] = useState(false);
  const [mainRepostCount, setMainRepostCount] = useState(24);
  const [isReplying, setIsReplying] = useState(false);
  const [replyName, setReplyName] = useState(user?.displayName || '');
  const [replyText, setReplyText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [commentsCount, setCommentsCount] = useState(12);
  const [reaction, setReaction] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  // Voice Recording State (STT)
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!firestore) return;
    const docRef = doc(firestore, 'social_engagements', docId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.comments) setComments(data.comments);
        if (data.mainRepostCount !== undefined) setMainRepostCount(data.mainRepostCount);
        if (data.globalReaction !== undefined) setReaction(data.globalReaction);
      } else {
        // Initial mock comments if none exist in Firestore
        setComments([
          { id: '1', name: 'Alex M.', text: 'This looks amazing! Can\'t wait to try it out.', replies: [] },
          { id: '2', name: 'Sarah J.', text: 'Really impressive integration of agents here.', replies: [] },
          { id: '3', name: 'David K.', text: 'The interface is incredibly smooth and responsive.', replies: [] }
        ]);
      }
    });

    const baseCount = platformName 
      ? platformName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100 
      : Math.floor(Math.random() * 100);
    setCommentsCount(baseCount + 12);

    return () => unsubscribe();
  }, [firestore, docId, platformName]);

  const syncToFirestore = async (newComments: Comment[]) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'social_engagements', docId);
    await setDoc(docRef, { comments: newComments }, { merge: true });
  };

  const handleEditSubmit = (id: string, newText: string) => {
    const editComment = (commentsList: Comment[]): Comment[] => {
      return commentsList.map(c => {
        if (c.id === id) return { ...c, text: newText };
        if (c.replies) return { ...c, replies: editComment(c.replies) };
        return c;
      });
    };
    const newComments = editComment(comments);
    setComments(newComments);
    syncToFirestore(newComments);
  };

  const handleDeleteClick = (id: string) => {
    const deleteComment = (commentsList: Comment[]): Comment[] => {
      return commentsList.filter(c => c.id !== id).map(c => ({
        ...c,
        replies: c.replies ? deleteComment(c.replies) : []
      }));
    };
    const newComments = deleteComment(comments);
    setComments(newComments);
    syncToFirestore(newComments);
  };

  const handleReplySubmit = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const finalName = user?.displayName || replyName.trim() || 'Guest';
    if (replyText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        name: finalName,
        text: replyText.trim(),
        userId: user?.uid || 'guest',
        photoUrl: user?.photoURL || null,
        replies: []
      };
      
      if (replyingToId) {
        const addReply = (commentsList: Comment[]): Comment[] => {
          return commentsList.map(c => {
            if (c.id === replyingToId) {
              return { ...c, replies: [newComment, ...(c.replies || [])] };
            }
            if (c.replies) {
              return { ...c, replies: addReply(c.replies) };
            }
            return c;
          });
        };
        const newComments = addReply(comments);
        setComments(newComments);
        syncToFirestore(newComments);
        setReplyingToId(null);
      } else {
        const newComments = [newComment, ...comments];
        setComments(newComments);
        syncToFirestore(newComments);
      }
      
      setCommentsCount(prev => prev + 1);
      setReplyText('');
      if (!replyName.trim()) setReplyName(finalName);
    }
  };

  const handleEmojiClick = (emojiIcon: string) => {
    const newReaction = reaction === emojiIcon ? null : emojiIcon;
    setReaction(newReaction);
    setShowEmojis(false);
    
    if (firestore) {
      const docRef = doc(firestore, 'social_engagements', docId);
      setDoc(docRef, { globalReaction: newReaction }, { merge: true });
    }
  };

  // STT Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        stream.getTracks().forEach(track => track.stop());
        
        setIsTranscribing(true);
        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const audioDataUri = reader.result as string;
            const response = await fetch('/api/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioDataUri }),
            });
            if (response.ok) {
              const result = await response.json();
              setReplyText(prev => prev + (prev ? ' ' : '') + result.transcription);
            }
            setIsTranscribing(false);
          };
        } catch (e) {
          setIsTranscribing(false);
        }
      };
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleReplyToComment = (id: string, handle: string) => {
    setIsReplying(true);
    setReplyingToId(id);
    setReplyText(prev => {
      if (!prev.includes(handle)) {
         return prev ? `${handle}${prev}` : handle;
      }
      return prev;
    });
    setTimeout(() => {
      document.getElementById('replyText')?.focus();
    }, 100);
  };

  return (
    <div className={cn("flex flex-col gap-3 pt-4 border-t border-border/20 mt-4 w-full", className)}>
      <div className="flex items-center justify-between py-1 border-y border-border/10 mt-2 mb-2">
        <div className="flex items-center gap-2 sm:gap-6">
          <button 
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span>{commentsCount}</span>
          </button>

          {/* Repost */}
          <button 
            onClick={() => {
              const newVal = !isMainReposted;
              setIsMainReposted(newVal);
              const newCount = newVal ? mainRepostCount + 1 : mainRepostCount - 1;
              setMainRepostCount(newCount);
              if (firestore) {
                const docRef = doc(firestore, 'social_engagements', docId);
                setDoc(docRef, { mainRepostCount: newCount }, { merge: true });
              }
            }}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors group",
              isMainReposted ? "text-green-500" : "text-muted-foreground hover:text-green-500"
            )}
          >
            <div className={cn("p-2 rounded-full transition-colors", isMainReposted ? "bg-green-500/10" : "group-hover:bg-green-500/10")}>
              <Repeat2 className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline">{mainRepostCount}</span>
          </button>

          {/* Reaction / Emojis */}
          <div 
            className="relative flex items-center"
            onMouseEnter={() => setShowEmojis(true)}
            onMouseLeave={() => setShowEmojis(false)}
          >
            <button 
              onClick={() => setReaction(reaction ? null : CUSTOM_REACTIONS[3].icon)}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors group",
                reaction ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              )}
            >
              <div className={cn("p-2 rounded-full transition-colors", reaction ? "bg-red-500/10" : "group-hover:bg-red-500/10")}>
                <Heart className={cn("w-4 h-4", reaction && "fill-current")} />
              </div>
              {reaction ? (
                <span className="leading-none flex items-center gap-1.5 hidden sm:flex">
                  {CUSTOM_REACTIONS.find(e => e.icon === reaction)?.icon} {CUSTOM_REACTIONS.find(e => e.icon === reaction)?.label}
                </span>
              ) : (
                <span className="hidden sm:inline">React</span>
              )}
            </button>
            
            <AnimatePresence>
              {showEmojis && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full mb-2 left-0 sm:left-1/2 sm:-translate-x-1/2 bg-background border border-border/50 rounded-xl shadow-xl flex flex-col p-1 z-50 backdrop-blur-xl min-w-[150px]"
                >
                  {CUSTOM_REACTIONS.map(e => (
                    <button
                      key={e.label}
                      onClick={() => handleEmojiClick(e.icon)}
                      className="text-sm hover:bg-primary/10 transition-colors p-2 rounded-lg flex items-center gap-3 text-left font-medium text-foreground"
                    >
                      <span className="text-lg">{e.icon}</span> {e.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Threads Logo */}
          <button className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors group relative" title="Share on Threads">
            <svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-current">
              <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.708C154.894 45.698 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 28.1874C147.036 10.1807 124.653 0.82135 97.0005 0.82135C66.4524 0.82135 42.148 10.4284 25.1846 29.3499C4.30069 52.6102 -0.222337 77.5855 0.00966956 96C-0.222337 114.415 4.30069 139.39 25.1846 162.65C42.148 181.572 66.4524 191.179 97.0005 191.179C121.78 191.179 140.75 184.225 154.912 170.076C173.056 151.947 172.932 128.053 166.527 113.141C161.945 102.463 153.642 94.0205 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
            </svg>
            <span className="sr-only">Threads</span>
          </button>
          
          {/* X Logo */}
          <button className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors group relative" title="Share on X">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="sr-only">X (Twitter)</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden flex flex-col gap-4 mt-2"
          >
            {/* Add new comment form - Twitter/Threads style */}
            <form onSubmit={handleReplySubmit} className="flex gap-3 pb-4 mb-2 border-b border-border/10">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                  {replyName ? replyName.charAt(0).toUpperCase() : '?'}
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <Input
                  id="replyName"
                  placeholder="Your Name (Optional)"
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                  className="h-7 text-sm bg-transparent border-0 border-b border-border/10 rounded-none focus-visible:ring-0 focus-visible:border-primary px-0 font-semibold mb-1"
                />
                <textarea
                  id="replyText"
                  placeholder={`Post your reply to ${platformName || 'this'}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReplySubmit(e);
                    }
                  }}
                  className="w-full min-h-[60px] text-sm bg-transparent border-0 resize-none focus:ring-0 px-0 py-1 text-foreground placeholder:text-muted-foreground/70 custom-scrollbar"
                  style={{ outline: 'none', boxShadow: 'none' }}
                />
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-muted-foreground/50">
                    <Smile className="w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
                    <button 
                      type="button"
                      onClick={toggleRecording} 
                      disabled={isTranscribing}
                      className={cn(
                        "p-1 rounded-full transition-colors relative", 
                        isRecording ? "text-red-500 bg-red-500/10" : "hover:text-primary hover:bg-primary/10",
                        isTranscribing && "opacity-50 cursor-not-allowed"
                      )}
                      title="Dictate with AI Whisper"
                    >
                      {isTranscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />)}
                      {isRecording && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />}
                    </button>
                  </div>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleReplySubmit}
                    className="rounded-full px-5 font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    disabled={!replyText.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </form>

            {/* Display existing comments */}
            <div className="flex flex-col gap-0 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar divide-y divide-border/10">
              {comments.map((comment) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onReplyClick={handleReplyToComment} 
                  onEditSubmit={handleEditSubmit}
                  onDeleteClick={handleDeleteClick}
                  currentUserUid={user?.uid}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
