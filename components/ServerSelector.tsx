'use client';

import React, { useState } from 'react';
import { ServerCard } from './ServerCard';
import { ServerModal } from './ServerModal';
import { TestServer } from '../lib/types';

interface ServerSelectorProps {
  selectedServer: TestServer;
  onSelectServer: (server: TestServer) => void;
  disabled?: boolean;
}

export const ServerSelector: React.FC<ServerSelectorProps> = ({
  selectedServer,
  onSelectServer,
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ServerCard
        selectedServer={selectedServer}
        onChangeServerClick={() => setIsModalOpen(true)}
        disabled={disabled}
      />

      <ServerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedServer={selectedServer}
        onSelectServer={onSelectServer}
      />
    </>
  );
};
