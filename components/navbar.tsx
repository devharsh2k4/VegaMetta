"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import {
  Code2,
  BookOpen,
  Settings,
  Save,
  FolderOpen,
  Github,
  Menu,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSave = () => {
    const element = document.createElement("a");
    const file = new Blob([localStorage.getItem('mettaCode') || ''], {
      type: 'text/plain'
    });
    element.href = URL.createObjectURL(file);
    element.download = "metta-code.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleOpen = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          if (typeof text === 'string') {
            localStorage.setItem('mettaCode', text);
            window.dispatchEvent(new CustomEvent('codeLoaded', { detail: text }));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Code2 className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold"> VegaMeTTa</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleOpen}>
              <FolderOpen className="h-4 w-4 mr-2" />
              Open
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.open('https://metta-lang.dev/docs/learn/learn.html', '_blank')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Documentation
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open('https://github.com/devharsh2k4/VegaMetta', '_blank')}
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <ModeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleOpen}>
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open('https://metta-lang.dev/docs/learn/learn.html', '_blank')}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Documentation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open('https://github.com/devharsh2k4/VegaMetta', '_blank')}>
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Configure your IDE settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            
            <p className="text-sm text-muted-foreground">
              Settings functionality will be implemented in future updates.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}