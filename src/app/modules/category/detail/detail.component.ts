import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Category } from 'src/app/models/category';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class CategoryDetailPage implements OnInit {

  isSuperUser: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public object: Category,
    private storage: StorageService,
    private dialogRef: MatDialogRef<CategoryDetailPage>,
  ) { }

  ngOnInit(): void {
    this.isSuperUser = this.storage.getUser().superUser;
  }

  close(){
    this.dialogRef.close();
  }
}
