
export const UserRole = {
  SYSTEM_ADMIN: 'system_admin',
  CLERGY: 'clergy',
  TREASURER: 'treasurer',
  SECRETARY: 'secretary',
  MEMBER: 'member'
};

export const MemberStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  VISITOR: 'visitor',
  TRANSFERRED: 'transferred',
  DECEASED: 'deceased'
};

export const EventType = {
  WORSHIP: 'worship',
  CONFERENCE: 'conference',
  BIBLE_STUDY: 'bible_study',
  TRAINING: 'training',
  WEDDING: 'wedding',
  FUNERAL: 'funeral',
  OTHER: 'other'
};

export const DonationType = {
  TITHE: 'tithe',
  OFFERING: 'offering',
  PLEDGE: 'pledge',
  SPECIAL: 'special',
  MISSIONS: 'missions'
};

export const PaymentMethod = {
  CASH: 'cash',
  MPESA: 'mpesa',
  BANK_TRANSFER: 'bank_transfer',
  CHEQUE: 'cheque',
  CARD: 'card',
  ONLINE: 'online'
};

export const EventStatus = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const MinistryRole = {
  LEADER: 'leader',
  CO_LEADER: 'co_leader',
  MEMBER: 'member',
  VOLUNTEER: 'volunteer'
};

export const MessageType = {
  ANNOUNCEMENT: 'announcement',
  REMINDER: 'reminder',
  ALERT: 'alert',
  NEWSLETTER: 'newsletter',
  PRAYER_UPDATE: 'prayer_update'
};

export const MessageStatus = {
  DRAFT: 'draft',
  SENT: 'sent',
  FAILED: 'failed',
  DELIVERED: 'delivered'
};
