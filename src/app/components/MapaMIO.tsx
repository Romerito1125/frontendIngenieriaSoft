// components/GrafoMIO.tsx
'use client';

import React from 'react';
import ReactFlow, { Background, Controls, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';

const nodes: Node[] = [
    { id: 'Versalles', data: { label: 'Versalles' }, position: { x: 900, y: 630 } },
    { id: 'Las Americas', data: { label: 'Las Americas' }, position: { x: 1000, y: 580 } },
    { id: 'Prados del Norte', data: { label: 'Prados del Norte' }, position: { x: 1200, y: 530 } },
    { id: 'Vipasa', data: { label: 'Vipasa' }, position: { x: 1300, y: 480 } },
    { id: 'Alamos', data: { label: 'Alamos' }, position: { x: 1400, y: 430 } },
    { id: 'Terminal Menga', data: { label: 'Menga' }, position: { x: 1500, y: 380 } },


    { id: 'Fátima', data: { label: 'Fátima' }, position: { x: 650, y: 730 } },
    { id: 'Popular', data: { label: 'Popular' }, position: { x: 700, y: 740 } },
    { id: 'Salomia', data: { label: 'Salomia' }, position: { x: 750, y: 750 } },
    { id: 'Flora Industrial', data: { label: 'Flora Industrial' }, position: { x: 800, y: 760 } },
    { id: 'Paso del Comercio', data: { label: 'Paso del Comercio' }, position: { x: 1000, y: 800 } },
];

const edges: Edge[] = [
    { id: 'Versalles-LasAmericas', source: 'Versalles', target: 'Las Americas' },

    { id: 'Las Americas-PradosDelNorte', source: 'Las Americas', target: 'Prados del Norte' },
    { id: 'PradosDelNorte-Vipasa', source: 'Prados del Norte', target: 'Vipasa' },
    { id: 'Vipasa-Alamos', source: 'Vipasa', target: 'Alamos' },
    { id: 'Alamos-Menga', source: 'Alamos', target: 'Menga' },

    { id: 'San Pedro-Fátima', source: 'San Pedro', target: 'Fátima' },
    { id: 'Fátima-Popular', source: 'Fátima', target: 'Popular' },
    { id: 'Popular-Salomia', source: 'Popular', target: 'Salomia' },
    { id: 'Salomia-Flora', source: 'Salomia', target: 'Flora Industrial' },
    { id: 'Flora-Calima', source: 'Flora Industrial', target: 'Calima' },
    { id: 'Calima-Guaduales', source: 'Calima', target: 'Los Guaduales' },
    { id: 'Guaduales-Pacará', source: 'Los Guaduales', target: 'Pacará' },
    { id: 'Pacará-Paso', source: 'Pacará', target: 'Paso del Comercio' },
];

export default function GrafoMIO() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
