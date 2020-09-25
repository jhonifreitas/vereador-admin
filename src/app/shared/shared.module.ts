import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { HighchartsChartModule } from 'highcharts-angular';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

import { PieComponent } from './widgets/pie/pie.component';
import { AreaComponent } from './widgets/area/area.component';
import { CardComponent } from './widgets/card/card.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SelectTagComponent } from './widgets/select-tag/select-tag.component';

@NgModule({
  declarations: [
    PieComponent,
    AreaComponent,
    CardComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    SelectTagComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatDividerModule,
    MatExpansionModule,
    ReactiveFormsModule,
    HighchartsChartModule,
  ],
  exports: [
    PieComponent,
    AreaComponent,
    CardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    SelectTagComponent,
  ]
})
export class SharedModule { }