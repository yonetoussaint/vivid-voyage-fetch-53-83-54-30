import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Send,CreditCard, ArrowRight, ArrowDownLeft, ArrowUpRight, TrendingUp, Clock } from 'lucide-react';
import { getAllExchangeRates, CurrencyRates } from '@/utils/currencyConverter';

interface StepOneTransferProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const StepOneTransfer: React.FC<StepOneTransferProps> = ({ amount, onAmountChange }) => {
  const [receiverAmount, setReceiverAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [liveRates, setLiveRates] = useState<CurrencyRates>({
    USD: 127.5,
    EUR: 144.8,
    GBP: 168.2,
    CAD: 97.3,
    AUD: 86.1,
    CHF: 147.9,
    JPY: 0.89
  });
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [lastEditedField, setLastEditedField] = useState<'send' | 'receive'>('send');

  // Currency options
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
  ];

  // Fetch live rates on component mount
  useEffect(() => {
    const fetchLiveRates = async () => {
      setIsLoadingRates(true);
      try {
        const rateData = await getAllExchangeRates();
        setLiveRates(rateData.rates);
        setLastUpdated(rateData.lastUpdated);
        setIsLive(rateData.isLive);
        console.log('Live exchange rates fetched:', rateData.rates);
      } catch (error) {
        console.error('Failed to fetch live exchange rates:', error);
        // Keep the default fallback rates
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchLiveRates();
  }, []);

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency) || currencies[0];
  const currentRate = liveRates[selectedCurrency] || 127.5;

  // Update receiver amount when send amount or rate changes (but not when user is editing receiver)
  useEffect(() => {
    if (lastEditedField === 'send') {
      const sendAmount = parseFloat(amount) || 0;
      const htgAmount = sendAmount * currentRate;
      setReceiverAmount(htgAmount.toFixed(2));
    }
  }, [amount, currentRate, lastEditedField]);

  // Update send amount when receiver amount or rate changes (but not when user is editing sender)
  useEffect(() => {
    if (lastEditedField === 'receive' && receiverAmount) {
      const htgAmount = parseFloat(receiverAmount) || 0;
      const sendAmount = htgAmount / currentRate;
      onAmountChange(sendAmount.toFixed(2));
    }
  }, [receiverAmount, currentRate, lastEditedField, onAmountChange]);

  const handleSendAmountChange = (value: string) => {
    setLastEditedField('send');
    onAmountChange(value);
  };

  const handleReceiverAmountChange = (value: string) => {
    setLastEditedField('receive');
    setReceiverAmount(value);
  };

  const sendAmount = parseFloat(amount) || 0;
  const transferFee = Math.ceil(sendAmount / 100) * 15; // $15 per $100 equivalent
  const totalAmount = sendAmount + transferFee;

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
        
        .ali-rate-indicator {
          background: linear-gradient(135deg, #ff4747, #ff6900);
          animation: pulse 2s infinite;
        }
        
        .ali-rate-card {
          border: 1px solid #000000 !important;
        }
        
        .ali-rate-card:hover {
          border-color: #333333 !important;
          transform: translateY(-1px);
          transition: all 0.3s ease;
        }
        
        .ali-fee-card {
          background: linear-gradient(135deg, #fff8f0, #ffebcd);
          border: 1px solid #ff6900;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .ali-total-highlight {
          color: #ff4747 !important;
        }
      `}</style>
      
      {/* Send Amount Input with Currency Selection */}
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
              className="pl-4 pr-20 text-2xl font-semibold border-0 shadow-none focus-visible:ring-0 bg-transparent text-ali-text-primary placeholder-ali-text-secondary placeholder:text-2xl placeholder:font-light h-12 transition-colors duration-200 w-full outline-none ali-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleSendAmountChange(e.target.value)}
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="h-6 w-auto border-0 bg-ali-orange-light text-ali-text-primary font-bold text-xs px-2 py-0 rounded-full focus:ring-0 border border-ali-border min-h-0 !py-0.5">
                  <SelectValue className="text-xs">{selectedCurrency}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border border-ali-border z-50">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-ali-text-primary">{currency.symbol}</span>
                        <span className="text-xs text-ali-text-secondary">{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Rate Section - Between Send and Receive Cards */}
      <div className="bg-ali-neutral rounded-xl border border-ali-border p-3 ali-rate-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ali-rate-indicator"></div>
            <span className="text-xs text-ali-text-secondary font-medium">Live BRH Rate</span>
          </div>
          <div className="text-sm text-ali-text-primary font-bold">
            1 {selectedCurrency} = {currentRate.toFixed(2)} HTG
          </div>
        </div>
      </div>

      {/* Receiver Amount Input - Now Editable */}
      <div className="bg-white rounded-xl border border-ali-border overflow-hidden ali-card">
        <div className="p-3 pb-2 relative">
          <div className="absolute top-2 right-2">
            <div className="bg-ali-secondary p-1.5 rounded-full">
              <ArrowDownLeft className="w-3 h-3 text-white" />
            </div>
          </div>
          <Label htmlFor="receiverAmount" className="text-xs font-bold text-ali-text-primary mb-2 block uppercase tracking-wide">
            Receiver Gets
          </Label>
          <div className="relative">
            <Input
              id="receiverAmount"
              type="number"
              className="pl-4 pr-12 text-2xl font-semibold border-0 shadow-none focus-visible:ring-0 bg-transparent text-ali-text-primary placeholder-ali-text-secondary placeholder:text-2xl placeholder:font-light h-12 transition-colors duration-200 w-full outline-none ali-input"
              placeholder="0.00"
              value={receiverAmount}
              onChange={(e) => handleReceiverAmountChange(e.target.value)}
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <span className="text-xs font-bold text-ali-text-primary bg-ali-red-light px-2 py-0.5 rounded-full border border-ali-border">
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
              Transfer fee
            </span>
            <span className="font-bold text-ali-text-primary">
              {selectedCurrencyData.symbol}{transferFee.toFixed(2)}
            </span>
          </div>
          <div className="border-t border-ali-border pt-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ali-text-primary text-sm flex items-center gap-1">
                <ArrowRight className="w-4 h-4" />
                Total to pay
              </span>
              <span className="text-xl font-bold text-ali-primary ali-total-highlight">
                {selectedCurrencyData.symbol}{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOneTransfer;