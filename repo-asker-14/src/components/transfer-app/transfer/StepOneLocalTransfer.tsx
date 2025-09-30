
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, CreditCard, ArrowRight } from 'lucide-react';

interface StepOneLocalTransferProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const StepOneLocalTransfer: React.FC<StepOneLocalTransferProps> = ({ amount, onAmountChange }) => {
  const handleSendAmountChange = (value: string) => {
    onAmountChange(value);
  };

  const htgAmount = parseFloat(amount) || 0;
  const transferFee = htgAmount * 0.15; // 15% fee
  const totalAmount = htgAmount + transferFee;

  return (
    <div className="space-y-4">
      <style>{`
        .ali-border { border-color: #ff6900; }
        .ali-text-primary { color: #ff4747; }
        .ali-text-secondary { color: #ff6900; }
        .ali-primary { background: linear-gradient(135deg, #ff4747, #ff6900); }
        .ali-secondary { background: linear-gradient(135deg, #ff6900, #ffab00); }
        .ali-neutral { background-color: #fff8f0; }
        .ali-orange-light { background: linear-gradient(135deg, #ff6900, #ffab00); }
        .ali-red-light { background: linear-gradient(135deg, #ff4747, #ff6900); }
        
        /* AliExpress-style enhancements */
        .ali-card {
          border: 1px solid #ff6900;
          background-clip: padding-box;
        }
        
        .ali-card:hover {
          border-color: #ff4747;
          transform: translateY(-1px);
          transition: all 0.3s ease;
        }
        
        .ali-input:focus {
          color: #ff4747 !important;
        }
        
        .ali-fee-card {
          background: linear-gradient(135deg, #fff8f0, #ffebcd);
          border: 1px solid #ff6900;
        }
        
        .ali-total-highlight {
          color: #ff4747 !important;
        }
      `}</style>
      
      {/* Send Amount Input */}
      <div className="bg-white rounded-xl border border-ali-border overflow-hidden ali-card">
        <div className="p-3 pb-2 relative">
          <div className="absolute top-2 right-2">
            <div className="bg-ali-primary p-1.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 text-white" />
            </div>
          </div>
          <Label htmlFor="amount" className="text-xs font-bold text-ali-text-primary mb-2 block uppercase tracking-wide">
            Send Amount
          </Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              className="pl-4 pr-12 text-2xl font-semibold border-0 shadow-none focus-visible:ring-0 bg-transparent text-ali-text-primary placeholder-ali-text-secondary placeholder:text-2xl placeholder:font-light h-12 transition-colors duration-200 w-full outline-none ali-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleSendAmountChange(e.target.value)}
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <span className="text-xs font-bold text-ali-text-primary bg-ali-orange-light px-2 py-0.5 rounded-full border border-ali-border">
                HTG
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* Fee Breakdown */}
      <div className="bg-ali-neutral rounded-xl border border-ali-border p-3 ali-fee-card">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ali-text-secondary font-medium flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              Transfer fee (15%)
            </span>
            <span className="font-bold text-ali-text-primary">
              {transferFee.toFixed(2)} HTG
            </span>
          </div>
          <div className="border-t border-ali-border pt-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ali-text-primary text-sm flex items-center gap-1">
                <ArrowRight className="w-4 h-4" />
                Total to pay
              </span>
              <span className="text-xl font-bold text-ali-primary ali-total-highlight">
                {totalAmount.toFixed(2)} HTG
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOneLocalTransfer;
