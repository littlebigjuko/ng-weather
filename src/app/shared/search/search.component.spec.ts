import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let comp: SearchComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchComponent,
        {
          provide: ElementRef,
          useValue: {
            nativeElement: {
              contains: (value) => {
                return '<span>test</span>'.indexOf(value) >= 0;
              },
            },
          },
        },
      ],
    });
    comp = TestBed.inject(SearchComponent);
  });

  it('component should be created', () => {
    expect(comp).toBeTruthy();
  });

  describe('constructHtml', () => {
    it('should provide proper html', () => {
      comp.filter = 'ab';
      expect(comp.constructHtml({ name: 'abc' })).toEqual('<b>Ab</b>c');
    });
    it('should provide html if filter is empty', () => {
      comp.filter = '';
      expect(comp.constructHtml({ name: 'abc' })).toEqual('Abc');
    });
    it('should provide html if multiple selections found', () => {
      comp.filter = 'a';
      expect(comp.constructHtml({ name: 'abca' })).toEqual('<b>A</b>bc<b>a</b>');
    });
  });

  describe('selectItem()', () => {
    it('should set filter, call inputChange(), emit value, remove focus', () => {
      const inputSpy = spyOn(comp, 'inputChange').and.stub();
      const searchSpy = spyOn(comp.search, 'emit').and.stub();
      comp.focus = true;
      comp.selectItem({ name: 'test' });
      expect(comp.filter).toEqual('test');
      expect(comp.focus).toBeFalsy();
      expect(inputSpy).toHaveBeenCalled();
      expect(searchSpy).toHaveBeenCalledWith({ name: 'test' });
    });
  });

  describe('inputChange()', () => {
    it('should set focus, filter list', () => {
      const list = [{ name: 'test' }, { name: 'abc1' }];
      const filteredListSpy = spyOn(comp.filteredList$, 'next').and.stub();
      comp.list = list;
      comp.filter = 'test';
      comp.inputChange();
      expect(filteredListSpy).toHaveBeenCalledWith([{ name: 'test', html: '<b>Test</b>' }]);
    });
  });

  describe('trackBy()', () => {
    it('should return name', () => {
      expect(comp.trackBy({ name: 'test' })).toEqual('test');
    });
  });

  describe('clickout()', () => {
    it('should set focus false', () => {
      comp.focus = true;
      comp.clickout({ target: 'abc' });
      expect(comp.focus).toBeFalsy();
    });

    it('should not set focus false', () => {
      comp.focus = true;
      comp.clickout({ target: 'test' });
      expect(comp.focus).toBeTruthy();
    });
  });
});
