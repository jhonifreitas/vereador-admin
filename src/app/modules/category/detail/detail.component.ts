import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-category-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class CategoryDetailPage implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public object: Category,
    private dialogRef: MatDialogRef<CategoryDetailPage>,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close();
  }
}
