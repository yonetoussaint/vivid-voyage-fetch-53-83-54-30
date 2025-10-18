import React from 'react';
import { Save, Bell, Link, EyeOff, Flag, UserX, Ban } from 'lucide-react';
import SlideUpPanel from '@/components/shared/SlideUpPanel';

interface PostMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePost?: () => void;
  onHidePost?: () => void;
  onReportPost?: () => void;
  onTurnOnNotifications?: () => void;
  onCopyLink?: () => void;
  onSnoozeUser?: () => void;
  onHideAllFromUser?: () => void;
  onBlockUser?: () => void;
  userName?: string;
  postId?: string;
}

const PostMenuPanel: React.FC<PostMenuPanelProps> = ({
  isOpen,
  onClose,
  onSavePost,
  onHidePost,
  onReportPost,
  onTurnOnNotifications,
  onCopyLink,
  onSnoozeUser,
  onHideAllFromUser,
  onBlockUser,
  userName = 'this user',
  postId
}) => {

  const handleCopyLink = async () => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    try {
      await navigator.clipboard.writeText(postUrl);
      console.log('Link copied to clipboard');
      // You can show a toast notification here
      if (onCopyLink) onCopyLink();
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
    onClose();
  };

  const handleSavePost = () => {
    console.log('Saving post:', postId);
    if (onSavePost) onSavePost();
    onClose();
  };

  const handleHidePost = () => {
    console.log('Hiding post:', postId);
    if (onHidePost) onHidePost();
    onClose();
  };

  const handleReportPost = () => {
    console.log('Reporting post:', postId);
    if (onReportPost) onReportPost();
    onClose();
  };

  const handleTurnOnNotifications = () => {
    console.log('Turning on notifications for post:', postId);
    if (onTurnOnNotifications) onTurnOnNotifications();
    onClose();
  };

  const handleSnoozeUser = () => {
    console.log('Snoozing user:', userName);
    if (onSnoozeUser) onSnoozeUser();
    onClose();
  };

  const handleHideAllFromUser = () => {
    console.log('Hiding all from user:', userName);
    if (onHideAllFromUser) onHideAllFromUser();
    onClose();
  };

  const handleBlockUser = () => {
    console.log('Blocking user:', userName);
    if (onBlockUser) onBlockUser();
    onClose();
  };

  const menuItems = [
    {
      icon: <Save className="w-5 h-5" />,
      title: "Save post",
      description: "Add this to your saved items",
      onClick: handleSavePost,
      color: "text-gray-900"
    },
    {
      icon: <EyeOff className="w-5 h-5" />,
      title: "Hide post",
      description: "See fewer posts like this",
      onClick: handleHidePost,
      color: "text-gray-900"
    },
    {
      icon: <Flag className="w-5 h-5" />,
      title: "Report post",
      description: `We won't let ${userName} know who reported this`,
      onClick: handleReportPost,
      color: "text-red-600"
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Turn on notifications for this post",
      description: "",
      onClick: handleTurnOnNotifications,
      color: "text-gray-900"
    },
    {
      icon: <Link className="w-5 h-5" />,
      title: "Copy link",
      description: "",
      onClick: handleCopyLink,
      color: "text-gray-900"
    },
    {
      icon: <UserX className="w-5 h-5" />,
      title: `Snooze ${userName} for 30 days`,
      description: "Temporarily stop seeing posts",
      onClick: handleSnoozeUser,
      color: "text-gray-900"
    },
    {
      icon: <Ban className="w-5 h-5" />,
      title: `Hide all from ${userName}`,
      description: "Stop seeing posts from this Page. They won't be notified that you unfollowed",
      onClick: handleHideAllFromUser,
      color: "text-gray-900"
    },
    {
      icon: <Ban className="w-5 h-5" />,
      title: `Block ${userName}'s profile`,
      description: "You won't be able to see or contact each other",
      onClick: handleBlockUser,
      color: "text-red-600"
    }
  ];

  return (
    <SlideUpPanel
      isOpen={isOpen}
      onClose={onClose}
      headerContent={
        <div className="flex items-center justify-between w-full">
          <h3 className="font-semibold text-gray-900 text-[17px]">
            Post Options
          </h3>
        </div>
      }
      className="p-0"
      preventBodyScroll={true}
    >
      <div className="p-0">
        {menuItems.map((item, index) => (
          <div key={item.title}>
            <button
              onClick={item.onClick}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-medium text-[15px] ${item.color}`}>
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-gray-600 text-[13px] mt-0.5 leading-tight">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            </button>
            {index < menuItems.length - 1 && (
              <div className="border-b border-gray-200 mx-4" />
            )}
          </div>
        ))}
      </div>
    </SlideUpPanel>
  );
};

export default PostMenuPanel;