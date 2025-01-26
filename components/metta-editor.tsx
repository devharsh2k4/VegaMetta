"use client";

import { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import ReactFlow, { 
  Node, 
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExamplesSidebar } from '@/components/examples-sidebar';
import { 
  Play, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const defaultEdgeOptions = {
  animated: true,
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
};

export default function MeTTaEditor() {
  const [code, setCode] = useState('! define factorial\n(= (factorial $n)\n   (if (== $n 0)\n       1\n       (* $n (factorial (- $n 1)))))');
  const [output, setOutput] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
   
    const savedCode = localStorage.getItem('mettaCode');
    if (savedCode) {
      setCode(savedCode);
    }

    
    const handleCodeLoaded = (event: CustomEvent) => {
      setCode(event.detail);
    };

    window.addEventListener('codeLoaded', handleCodeLoaded as EventListener);

    return () => {
      window.removeEventListener('codeLoaded', handleCodeLoaded as EventListener);
    };
  }, []);

  useEffect(() => {
    
    localStorage.setItem('mettaCode', code);
  }, [code]);

  const interpretCode = useCallback(() => {
    try {
      const lines = code.split('\n');
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      
      lines.forEach((line, index) => {
        newNodes.push({
          id: `node-${index}`,
          data: { 
            label: line.trim(),
          },
          position: { x: 250, y: 100 + (index * 100) },
          className: 'bg-background border-2 border-border p-4 rounded-lg shadow-lg'
        });

        if (index > 0) {
          newEdges.push({
            id: `edge-${index}`,
            source: `node-${index - 1}`,
            target: `node-${index}`,
            type: 'smoothstep',
            className: 'animate-pulse'
          });
        }
      });

      setNodes(newNodes);
      setEdges(newEdges);
      setOutput('Code interpreted successfully');
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
    }
  }, [code, setNodes, setEdges]);

  const resetFlow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setOutput('');
  }, [setNodes, setEdges]);

  const handleZoomIn = useCallback(() => {
    const flowInstance = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (flowInstance) {
      const transform = flowInstance.style.transform;
      const scale = parseFloat(transform.split('scale(')[1]) || 1;
      flowInstance.style.transform = transform.replace(`scale(${scale})`, `scale(${scale * 1.2})`);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    const flowInstance = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (flowInstance) {
      const transform = flowInstance.style.transform;
      const scale = parseFloat(transform.split('scale(')[1]) || 1;
      flowInstance.style.transform = transform.replace(`scale(${scale})`, `scale(${scale * 0.8})`);
    }
  }, []);

  const handleFitView = useCallback(() => {
    const flowInstance = document.querySelector('.react-flow') as HTMLElement;
    if (flowInstance) {
      flowInstance.dispatchEvent(new Event('fitView'));
    }
  }, []);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-12 gap-4 p-4 h-[calc(100vh-4rem)]">
        {showSidebar && (
          <div className="col-span-2">
            <ExamplesSidebar onSelectExample={setCode} />
          </div>
        )}
        <div className={`${showSidebar ? 'col-span-10' : 'col-span-12'} space-y-4`}>
          <div className="grid grid-cols-2 gap-4 h-full">
            <div className="space-y-4">
              <Card className="h-2/3">
                <div className="flex justify-between items-center p-2 border-b">
                  <h3 className="font-semibold">Code Editor</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSidebar(!showSidebar)}
                  >
                    {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                  </Button>
                </div>
                <Editor
                  height="calc(100% - 3rem)"
                  defaultLanguage="scheme"
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              </Card>
              <Card className="h-1/3">
                <Tabs defaultValue="output" className="h-full">
                  <div className="flex justify-between items-center p-2 border-b">
                    <TabsList>
                      <TabsTrigger value="output">Output</TabsTrigger>
                      <TabsTrigger value="console">Console</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="output" className="p-4 h-[calc(100%-3rem)]">
                    <pre className="bg-muted p-2 rounded h-full overflow-auto">
                      {output}
                    </pre>
                  </TabsContent>
                  <TabsContent value="console" className="p-4 h-[calc(100%-3rem)]">
                    <pre className="bg-muted p-2 rounded h-full overflow-auto">
                      Console output will appear here...
                    </pre>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
            <Card className="relative h-full">
              <div className="absolute top-4 right-4 z-10 space-x-2">
                <Button onClick={interpretCode} size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
                <Button onClick={resetFlow} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                className="bg-muted/50"
              >
                <Background />
                <Controls />
                <Panel position="bottom-center" className="bg-background/90 p-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" onClick={handleZoomIn}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleZoomOut}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleFitView}>
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Panel>
              </ReactFlow>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}