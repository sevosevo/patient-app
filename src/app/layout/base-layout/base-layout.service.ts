import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

export interface BaseLayoutMenuItem {
  path: string;
  label: string;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class BaseLayoutService {

  readonly toolbarTitleSubject = new BehaviorSubject<string>('');
  readonly toolbarTitle$ = this.toolbarTitleSubject.asObservable();

  readonly menuItemsSubject = new BehaviorSubject<BaseLayoutMenuItem[]>([]);
  readonly menuItems$ = this.menuItemsSubject.asObservable();

}
