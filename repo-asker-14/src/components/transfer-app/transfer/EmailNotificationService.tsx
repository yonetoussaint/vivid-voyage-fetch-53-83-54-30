
import { toast } from "@/components/transfer-app/hooks/use-toast";

interface EmailNotificationData {
  recipientEmail: string;
  senderName: string;
  amount: number;
  currency: string;
  transferId: string;
}

export class EmailNotificationService {
  static async sendTransferNotification(data: EmailNotificationData): Promise<boolean> {
    try {
      // In a real application, this would make an API call to your backend
      // which would then send the email using a service like SendGrid, Mailgun, etc.
      
      console.log('Sending transfer notification email:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just show a success toast
      toast({
        title: "Email Notification Sent",
        description: `Transfer notification sent to ${data.recipientEmail}`,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      
      toast({
        title: "Email Notification Failed",
        description: "Failed to send email notification. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  }
  
  static async sendReceiptEmail(data: EmailNotificationData): Promise<boolean> {
    try {
      console.log('Sending receipt email:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Receipt Email Sent",
        description: `Receipt sent to ${data.recipientEmail}`,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to send receipt email:', error);
      
      toast({
        title: "Receipt Email Failed",
        description: "Failed to send receipt email. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  }

  static async sendTransferConfirmation(
    email: string,
    transferData: any,
    transactionId: string
  ): Promise<boolean> {
    try {
      const emailData = {
        to: email,
        subject: "Money Transfer Confirmation - Transaction Completed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h1 style="color: #10b981; text-align: center; margin-bottom: 30px;">💰 Money Transfer Successful!</h1>
              
              <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin-top: 0;">Transfer Details</h2>
                <p><strong>Amount Sent:</strong> $${transferData.amount} USD</p>
                <p><strong>Recipient:</strong> ${transferData.receiverDetails.firstName} ${transferData.receiverDetails.lastName}</p>
                <p><strong>Location:</strong> ${transferData.receiverDetails.commune}, ${transferData.receiverDetails.department}</p>
                <p><strong>Transaction ID:</strong> ${transactionId}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Your Email:</strong> ${email}</p>
              </div>
              
              <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #065f46; margin-top: 0;">📱 Next Steps</h3>
                <p>Your money transfer has been processed successfully and will be available for pickup within 24-48 hours.</p>
                <p>The recipient will receive an SMS notification at <strong>+509 ${transferData.receiverDetails.phoneNumber}</strong> when the funds are ready for pickup.</p>
              </div>
              
              <div style="background-color: #fff7ed; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #c2410c; margin-top: 0;">💡 Important Information</h3>
                <p>• Keep this email as your receipt</p>
                <p>• Transaction ID: <strong>${transactionId}</strong></p>
                <p>• Customer support: support@example.com</p>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #6b7280; font-size: 14px;">
                  This is an automated confirmation email. Please keep this for your records.
                </p>
              </div>
            </div>
          </div>
        `,
        text: `Money Transfer Confirmation - Your transfer of $${transferData.amount} USD to ${transferData.receiverDetails.firstName} ${transferData.receiverDetails.lastName} has been completed successfully. Transaction ID: ${transactionId}. The recipient will be notified when funds are ready for pickup within 24-48 hours.`
      };

      console.log('Sending email notification to:', email);
      console.log('Using transaction ID:', transactionId);
      
      const response = await fetch('https://resend-u11p.onrender.com/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        console.log('Email notification sent successfully');
        toast({
          title: "Email Sent",
          description: `Confirmation email sent to ${email}`,
        });
        return true;
      } else {
        console.error('Failed to send email notification');
        return false;
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  }
}

// Export instance for easy usage
export const emailNotificationService = new EmailNotificationService();
