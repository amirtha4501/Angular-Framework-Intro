import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaders(): Promise<Leader[]> {
    return new Promise(resolve => {
      setTimeout(() =>resolve(LEADERS), 4000);
    });
  }

  getLeader(id: string): Promise<Leader> {
    return new Promise(resolve => {
      setTimeout(() => resolve(LEADERS.filter((lead) => (lead.id === id)) [0]), 4000);
    });
  }

  getFeaturedLeader(): Promise<Leader> {
    return new Promise(resolve => {
      setTimeout(() => resolve(LEADERS.filter((lead) => lead.featured) [0]), 4000);
    });
  }

}
