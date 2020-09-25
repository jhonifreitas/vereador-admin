import { FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-widget-select-tag',
  templateUrl: './select-tag.component.html',
  styleUrls: ['./select-tag.component.scss']
})
export class SelectTagComponent implements OnInit {

  @Input() placeholder: string;
  @Input() control: FormControl;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() { }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();
    const values:string[] = this.control.value || [];
    
    if (value && !values.find(val => val == value)) {
      this.control.setValue([...values, value.trim()]);
      this.control.updateValueAndValidity();
      input.value = '';
    }
  }

  remove(index: number) {
    this.control.value.splice(index, 1);
    this.control.updateValueAndValidity();
  }

}
