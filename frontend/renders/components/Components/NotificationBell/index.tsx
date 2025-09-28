import './styles.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../src/contexts/AuthContext';
import { notificationService } from '../../../../src/services/notificationService';
import { type Notification } from '../../../../src/types/Notification';
import { BellIcon } from '../Icons';

const NotificationBell: React.FC = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    
    const unsubscribe = notificationService.subscribeToNotifications(currentUser.uid, (data) => {
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notification: Notification) => {
    setIsOpen(false);
    if (!notification.isRead) {
      await notificationService.markAsRead(notification.id);
    }
    navigate(notification.link);
  };

  return (
    <div className="notification-bell">
      <button onClick={() => setIsOpen(!isOpen)} className="bell-button">
        <BellIcon />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            <ul>
              {notifications.map(n => (
                <li key={n.id} className={!n.isRead ? 'unread' : ''} onClick={() => handleNotificationClick(n)}>
                  <p>{n.message}</p>
                  <small>{n.createdAt?.toDate().toLocaleDateString('pt-BR')}</small>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-notifications">Nenhuma notificação</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;