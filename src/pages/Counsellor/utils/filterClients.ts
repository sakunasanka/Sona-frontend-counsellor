import { Client, FilterType, AnonymousFilterType, StudentFilterType } from '../components';

export const filterClients = (
  clients: Client[],
  searchQuery: string,
  activeFilter: FilterType,
  anonymousFilter: AnonymousFilterType,
  studentFilter: StudentFilterType
): Client[] => {
  return clients.filter(client => {
    // Filter by search query
    const matchesSearch = client.anonymous 
      ? (client.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         "anonymous client".includes(searchQuery.toLowerCase()) ||
         (client.institution && client.institution.toLowerCase().includes(searchQuery.toLowerCase())))
      : client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.institution && client.institution.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by status
    const matchesFilter = activeFilter === 'all' || client.status === activeFilter;
    
    // Filter by anonymous status
    const matchesAnonymousFilter = anonymousFilter === 'all' || 
      (anonymousFilter === 'anonymous' && client.anonymous) || 
      (anonymousFilter === 'identified' && !client.anonymous);
      
    // Filter by student status
    const matchesStudentFilter = studentFilter === 'all' || 
      (studentFilter === 'student' && client.student) || 
      (studentFilter === 'non-student' && !client.student);
    
    return matchesSearch && matchesFilter && matchesAnonymousFilter && matchesStudentFilter;
  });
};
