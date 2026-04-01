import { TeamMember } from '../types';

export const teamData: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Berrion',
    role: 'CEO',
    description: 'Visionary leader with a passion for disruptive innovation and excellence.',
    photo: 'https://picsum.photos/seed/ceo/400/400',
    members: [
      { id: '1-1', name: 'Sarah Jenkins', role: 'Executive Assistant', description: '', photo: 'https://picsum.photos/seed/ea/100/100' },
      { id: '1-2', name: 'Michael Chen', role: 'Strategy Advisor', description: '', photo: 'https://picsum.photos/seed/sa/100/100' }
    ]
  },
  {
    id: '2',
    name: 'Elena Vance',
    role: 'Secretary',
    description: 'Organizational mastermind ensuring seamless operations across all departments.',
    photo: 'https://picsum.photos/seed/secretary/400/400',
    members: [
      { id: '2-1', name: 'David Miller', role: 'Admin Specialist', description: '', photo: 'https://picsum.photos/seed/admin/100/100' }
    ]
  },
  {
    id: '3',
    name: 'Julian Thorne',
    role: 'Treasurer',
    description: 'Financial strategist focused on sustainable growth and fiscal responsibility.',
    photo: 'https://picsum.photos/seed/treasurer/400/400',
    members: [
      { id: '3-1', name: 'Lisa Wong', role: 'Accountant', description: '', photo: 'https://picsum.photos/seed/acc/100/100' }
    ]
  },
  {
    id: '4',
    name: 'Marcus Reed',
    role: 'Marketing Manager',
    description: 'Creative force behind our brand identity and market expansion strategies.',
    photo: 'https://picsum.photos/seed/marketing/400/400',
    members: [
      { id: '4-1', name: 'Emma Stone', role: 'Social Media Lead', description: '', photo: 'https://picsum.photos/seed/social/100/100' },
      { id: '4-2', name: 'James Bond', role: 'Content Creator', description: '', photo: 'https://picsum.photos/seed/content/100/100' }
    ]
  },
  {
    id: '5',
    name: 'Sophia Loren',
    role: 'Souvenir Manager',
    description: 'Curating unique brand experiences through innovative product design.',
    photo: 'https://picsum.photos/seed/souvenir/400/400',
    members: [
      { id: '5-1', name: 'Tom Hardy', role: 'Product Designer', description: '', photo: 'https://picsum.photos/seed/design/100/100' }
    ]
  },
  {
    id: '6',
    name: 'Gordon Ramsay',
    role: 'F&B Manager',
    description: 'Elevating our corporate hospitality with world-class culinary standards.',
    photo: 'https://picsum.photos/seed/fb/400/400',
    members: [
      { id: '6-1', name: 'Jamie Oliver', role: 'Head Chef', description: '', photo: 'https://picsum.photos/seed/chef/100/100' }
    ]
  }
];
