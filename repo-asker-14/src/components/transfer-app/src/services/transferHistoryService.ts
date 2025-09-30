
import { TransferData } from '@/pages/MobileMultiStepTransferSheetPage';

export interface SavedTransfer {
  id: string;
  recipient: string;
  amount: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  transferData: TransferData;
  transactionId: string;
}

class TransferHistoryService {
  private static STORAGE_KEY = 'transfer_history';

  static saveTransfer(transferData: TransferData, transactionId: string): void {
    try {
      const existingHistory = this.getTransferHistory();
      
      const newTransfer: SavedTransfer = {
        id: transactionId,
        recipient: `${transferData.receiverDetails.firstName} ${transferData.receiverDetails.lastName}`,
        amount: `${transferData.amount} USD`,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        status: 'Completed',
        transferData,
        transactionId
      };

      const updatedHistory = [newTransfer, ...existingHistory];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory));
      
      console.log('Transfer saved to history:', newTransfer);
    } catch (error) {
      console.error('Failed to save transfer to history:', error);
    }
  }

  static getTransferHistory(): SavedTransfer[] {
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Failed to retrieve transfer history:', error);
      return [];
    }
  }

  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export default TransferHistoryService;
