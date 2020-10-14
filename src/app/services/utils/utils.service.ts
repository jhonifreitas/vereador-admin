import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxImageCompressService } from 'ngx-image-compress';
import { DeleteDialog } from 'src/app/shared/components/delete/delete.component';
import { LoadingDialog } from 'src/app/shared/components/loading/loading.component';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private date: DatePipe,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private imageCompress: NgxImageCompressService
  ) { }

  message(
    text:string,
    color?: 'success' | 'warn',
    action?: string,
    duration?: number,
    horizontal?: 'start' | 'center' | 'end',
    vertical?: 'top' | 'bottom'
  ) {
    this.snackBar.open(text, action || 'ok', {
      duration: duration || 4000,
      panelClass: color ? 'mat-'+color : null,
      horizontalPosition: horizontal || 'end',
      verticalPosition: vertical || 'top'
    })
  }

  loading(msg: string) {
    return this.dialog.open(LoadingDialog, {
      width: '30vw',
      data: {msg: msg},
      disableClose: true
    });
  }

  form(component: ComponentType<unknown>, object: any) {
    let maxWidth = '95vw';
    if(window.innerWidth > 960){
      maxWidth = '50vw';
    }
    return new Promise(resolve => {
      const dialog = this.dialog.open(component, {
        data: object,
        maxWidth: maxWidth
      });
      dialog.afterClosed().subscribe(async (result: any) => {
        if(result){
          resolve(result);
        }
      })
    })
  }

  detail(component: ComponentType<unknown>, object: any) {
    let maxWidth = '95vw';
    if(window.innerWidth > 960){
      maxWidth = '50vw';
    }
    this.dialog.open(component, {
      data: object,
      minWidth: '30vw',
      maxWidth: maxWidth,
      panelClass: 'dialog-view',
    })
  }

  delete() {
    return new Promise(resolve => {
      const dialog = this.dialog.open(DeleteDialog, {
        maxWidth: '95vw',
        panelClass: 'dialog-delete',
      });
      dialog.afterClosed().subscribe(async (remove: boolean) => {
        if(remove){
          resolve(remove);
        }
      })
    })
  }

  formatDate(value: any, format: string): string {
    return this.date.transform(value, format);
  }

  uploadCompress(file: File): Promise<{base64: string; file: Blob; width: number; height: number}> {
    return new Promise(async resolve => {
      const base64 = await this.readFile(file);
      const orientation = -1;
      this.imageCompress.compressFile(base64, orientation, 50, 50).then(result => {
        // CONVERT BASE64 TO FILE
        const compressed = this.covertBase64ToBlob(result);
        const img = new Image();
        img.onload = (event) => {
          const target = event.target as any;
          resolve({base64: result, file: compressed, width: target.width, height: target.height});
        }
        img.src = result;
      });
    });
  }

  covertBase64ToBlob(base64: string) {
    const byteString = window.atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], { type: 'image/png' });
  }

  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };
  
      reader.onerror = e => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };
  
      if (!file) {
        console.error('No file to read.');
        return reject(null);
      }
  
      reader.readAsDataURL(file);
    });
  }

  // CPF
  validateCPF(control: FormControl) {
    const cpf = control.value;

    let digit_1 = 0;
    let digit_2 = 0;
    let valid = false;

    const regex = new RegExp('[0-9]{11}');

    if (
      cpf == '00000000000' ||
      cpf == '11111111111' ||
      cpf == '22222222222' ||
      cpf == '33333333333' ||
      cpf == '44444444444' ||
      cpf == '55555555555' ||
      cpf == '66666666666' ||
      cpf == '77777777777' ||
      cpf == '88888888888' ||
      cpf == '99999999999' ||
      !regex.test(cpf)
    ){
      valid = false;
    } else {
      for(let i = 0; i < 10; i++){
        digit_1 = i < 9 ? (digit_1 + (parseInt(cpf[i]) * (11-i-1))) % 11 : digit_1;
        digit_2 = (digit_2 + (parseInt(cpf[i]) * (11-i))) % 11;
      }

      valid = ((parseInt(cpf[9]) == (digit_1 > 1 ? 11 - digit_1 : 0)) && 
                (parseInt(cpf[10]) == (digit_2 > 1 ? 11 - digit_2 : 0)))
    }

    if (valid) return null;
    return { invalid: true };
  }

  cleanCPF(cpf: string) {
    return cpf.replace(/\./gi, '').replace('-', '');
  }
}
