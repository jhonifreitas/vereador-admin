import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// MATERIAL
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

// ===============================================================================
// MODULES =======================================================================
// ===============================================================================
import { DashboardPage } from 'src/app/modules/dashboard/dashboard.component';
import { DeleteDialog } from 'src/app/shared/components/delete/delete.component';
import { LoadingDialog } from 'src/app/shared/components/loading/loading.component';
// CATEGORY
import { CategoryListPage } from 'src/app/modules/category/list/list.component';
import { CategoryFormPage } from 'src/app/modules/category/form/form.component';
import { CategoryDetailPage } from 'src/app/modules/category/detail/detail.component';
// TAB
import { TabListPage } from 'src/app/modules/tab/list/list.component';
import { TabFormPage } from 'src/app/modules/tab/form/form.component';
import { TabDetailPage } from 'src/app/modules/tab/detail/detail.component';
// SOCIAL
import { SocialListPage } from 'src/app/modules/social/list/list.component';
import { SocialFormPage } from 'src/app/modules/social/form/form.component';
import { SocialDetailPage } from 'src/app/modules/social/detail/detail.component';
// CONFIG
import { ConfigListPage } from 'src/app/modules/config/list/list.component';
import { ConfigFormPage } from 'src/app/modules/config/form/form.component';
import { ConfigDetailPage } from 'src/app/modules/config/detail/detail.component';
// ADMIN
import { AdminListPage } from 'src/app/modules/admin/list/list.component';
import { AdminFormPage } from 'src/app/modules/admin/form/form.component';
import { AdminDetailPage } from 'src/app/modules/admin/detail/detail.component';
// GROUP
import { GroupListPage } from 'src/app/modules/group/list/list.component';
import { GroupFormPage } from 'src/app/modules/group/form/form.component';
import { GroupDetailPage } from 'src/app/modules/group/detail/detail.component';
// PERMISSION
import { PermissionListPage } from 'src/app/modules/permission/list/list.component';
import { PermissionFormPage } from 'src/app/modules/permission/form/form.component';
import { PermissionDetailPage } from 'src/app/modules/permission/detail/detail.component';

// MASK
import { NgxMaskModule } from 'ngx-mask';
// DROPZONE
import { NgxDropzoneModule } from 'ngx-dropzone';
// QUILL
import { QuillModule } from 'ngx-quill';
// COMPRESS
import { NgxImageCompressService } from 'ngx-image-compress';
// SELECT FILTER
import { MatSelectFilterModule } from 'mat-select-filter';
// LOTTIE
import { LottieModule } from 'ngx-lottie';
export function playerFactory() {return import('lottie-web');}

// DEFAULT
import { Global } from 'src/app/models/global';
import { DefaultLayout } from './default.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { translateMatPaginator } from 'src/app/services/localization/localization.service';

@NgModule({
  declarations: [
    TabListPage,
    TabFormPage,
    DeleteDialog,
    TabDetailPage,
    DefaultLayout,
    LoadingDialog,
    AdminListPage,
    AdminFormPage,
    GroupListPage,
    GroupFormPage,
    DashboardPage,
    SocialListPage,
    SocialFormPage,
    ConfigFormPage,
    ConfigListPage,
    AdminDetailPage,
    GroupDetailPage,
    SocialDetailPage,
    ConfigDetailPage,
    CategoryListPage,
    CategoryFormPage,
    CategoryDetailPage,
    PermissionListPage,
    PermissionFormPage,
    PermissionDetailPage,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    SharedModule,
    MatCardModule,
    MatIconModule,
    MatSortModule,
    MatListModule,
    MatTableModule,
    DragDropModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatRippleModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    NgxDropzoneModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatSelectFilterModule,
    MatAutocompleteModule,
    QuillModule.forRoot(),
    NgxMaskModule.forRoot(),
    MatProgressSpinnerModule,
    LottieModule.forRoot({player: playerFactory, useCache: true})
  ],
  providers: [
    Global,
    NgxImageCompressService,
    { provide: MatPaginatorIntl, useValue: translateMatPaginator() }
  ]
})
export class DefaultLayoutModule { }
