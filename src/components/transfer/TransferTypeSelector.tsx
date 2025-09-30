import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TransferTypeSelectorProps {
  transferType: 'international' | 'national';
  onTransferTypeChange: (value: 'international' | 'national') => void;
  disableNavigation?: boolean;
}

const TransferTypeSelector: React.FC<TransferTypeSelectorProps> = ({ 
  transferType, 
  onTransferTypeChange,
  disableNavigation = false 
}) => {
  const navigate = useNavigate();

  const handleValueChange = (value: string) => {
    const newTransferType = value as 'international' | 'national';
    onTransferTypeChange(newTransferType);

    if (!disableNavigation) {
      // Unify navigation to a single multi-step page, passing type in state.
      navigate('/transfer', { 
        state: { transferType: newTransferType } 
      });
    }
  };

  return (
    <div className="w-full">
      <style>{`
        .compact-tabs-list {
          height: 40px !important;
          padding: 3px !important;
        }
        .compact-tab-trigger {
          height: 34px !important;
          padding: 6px 12px !important;
          font-size: 14px !important;
          min-height: 34px !important;
          line-height: 1.3 !important;
        }
        .compact-tab-trigger[data-state="active"] {
          height: 34px !important;
        }
      `}</style>
      <Tabs value={transferType} onValueChange={handleValueChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 compact-tabs-list">
          <TabsTrigger 
            value="international" 
            className="compact-tab-trigger"
          >
            International
          </TabsTrigger>
          <TabsTrigger 
            value="national" 
            className="compact-tab-trigger"
          >
            National
          </TabsTrigger>
        </TabsList>
        <TabsContent value="international">
        </TabsContent>
        <TabsContent value="national">
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransferTypeSelector;