import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SearchData } from 'app/models/SearchData';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

interface SearchDataWithHtml extends SearchData {
  html: string;
}

@Component({
  selector: 'app-search',
  styleUrls: ['./search.component.scss'],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  @Input() list: SearchData[] = [];
  @Input() placeholder: string;

  @Output() search: EventEmitter<SearchData> = new EventEmitter();

  filter: string = '';
  focus: boolean = false;
  filteredList$: Subject<SearchDataWithHtml[]> = new Subject();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.focus = false;
    }
  }

  trackBy(item: SearchData): string {
    return item.name;
  }

  inputChange() {
    this.focus = true;
    const filteredList = this.list
      .filter((item) => item.name.toLowerCase().includes(this.filter.toLowerCase()))
      .map((item) => ({ ...item, html: this.constructHtml(item) }));
    this.filteredList$.next(filteredList);
  }

  selectItem(value: SearchData) {
    this.filter = value.name;
    this.inputChange();
    this.focus = false;
    this.search.emit(value);
  }

  constructHtml(item: SearchData) {
    const capitalize = (value) => value[0].toUpperCase() + value.slice(1);
    let _filter = this.filter.toLowerCase();
    const splitted = item.name.toLowerCase().split(_filter.length ? _filter : null);
    if (!splitted[0].length) _filter = capitalize(_filter);
    let text: string = '';
    for (let i = 0; i < splitted.length; i++)
      text += splitted[i] + (i === splitted.length - 1 ? '' : `<b>${i == 0 ? _filter : _filter.toLowerCase()}</b>`);
    return capitalize(text);
  }
}
