'use client';

import React, { useState } from 'react';
import { Search, Send, Image as ImageIcon, Paperclip, MoreVertical, Phone } from 'lucide-react';
import Image from 'next/image';

const CONVERSATIONS = [
  { id: 1, name: 'Alice Smith', product: 'Sony A7 IV Camera', lastMessage: 'Sure, I can include the 50mm lens.', time: '10:42 AM', unread: 2, online: true },
  { id: 2, name: 'TechRentals', product: 'MacBook Pro M1', lastMessage: 'Is the return scheduled for tomorrow?', time: 'Yesterday', unread: 0, online: false },
  { id: 3, name: 'Bob Builder', product: 'Bosch Impact Drill', lastMessage: 'Thanks!', time: 'Oct 24', unread: 0, online: false },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(CONVERSATIONS[0]);

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      
      {/* Sidebar - Conversation List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-border bg-card flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-medium mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search conversations..." className="w-full bg-background border border-border pl-9 pr-4 py-2 text-sm focus:border-[#A9C5A0] outline-none" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map(conv => (
            <div 
              key={conv.id} 
              onClick={() => setActiveChat(conv)}
              className={`p-4 border-b border-border cursor-pointer transition-colors ${activeChat.id === conv.id ? 'bg-muted/50' : 'hover:bg-muted/20'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="font-medium text-sm flex items-center gap-2">
                  {conv.name}
                  {conv.online && <span className="w-2 h-2 rounded-full bg-[#C5EFCB]" />}
                </div>
                <div className="text-[10px] text-muted-foreground">{conv.time}</div>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#A9C5A0] mb-1">{conv.product}</div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground truncate pr-4">{conv.lastMessage}</div>
                {conv.unread > 0 && (
                  <div className="w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center text-[9px] font-bold shrink-0">
                    {conv.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-background hidden md:flex">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-medium flex items-center gap-2">
              {activeChat.name}
              {activeChat.online && <span className="w-2 h-2 rounded-full bg-[#C5EFCB]" />}
            </h2>
            <div className="text-xs text-muted-foreground">Regarding: {activeChat.product}</div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Phone className="w-4 h-4" /></button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1">Today</div>
          </div>
          
          <div className="flex justify-start">
            <div className="bg-card border border-border p-4 max-w-[80%] rounded-tr-xl rounded-br-xl rounded-bl-xl">
              <p className="text-sm">Hi there! I&apos;m interested in renting the camera for a weekend shoot. Does it come with a 50mm lens?</p>
              <div className="text-[10px] text-muted-foreground mt-2 text-right">10:30 AM</div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-foreground text-background p-4 max-w-[80%] rounded-tl-xl rounded-bl-xl rounded-br-xl">
              <p className="text-sm">Hello! Yes, it does. I can also include an extra battery for free.</p>
              <div className="text-[10px] text-muted-foreground/70 mt-2 text-right">10:35 AM</div>
            </div>
          </div>

          <div className="flex justify-start">
            <div className="bg-card border border-border p-4 max-w-[80%] rounded-tr-xl rounded-br-xl rounded-bl-xl">
              <p className="text-sm">That&apos;s perfect. I will go ahead and book it now.</p>
              <div className="text-[10px] text-muted-foreground mt-2 text-right">10:40 AM</div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="bg-foreground text-background p-4 max-w-[80%] rounded-tl-xl rounded-bl-xl rounded-br-xl">
              <p className="text-sm">Sure, I can include the 50mm lens.</p>
              <div className="text-[10px] text-muted-foreground/70 mt-2 text-right">10:42 AM</div>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card shrink-0">
          <div className="flex items-center gap-2">
            <button className="p-3 text-muted-foreground hover:text-foreground transition-colors"><Paperclip className="w-5 h-5" /></button>
            <button className="p-3 text-muted-foreground hover:text-foreground transition-colors"><ImageIcon className="w-5 h-5" /></button>
            <input type="text" placeholder="Type a message..." className="flex-1 bg-background border border-border px-4 py-3 text-sm focus:border-[#A9C5A0] outline-none" />
            <button className="bg-foreground text-background p-3 hover:bg-foreground/90 transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="text-[10px] text-center text-muted-foreground mt-2">
            Messages are end-to-end encrypted. Never share your passwords or payment details outside the platform.
          </div>
        </div>

      </div>
    </div>
  );
}
