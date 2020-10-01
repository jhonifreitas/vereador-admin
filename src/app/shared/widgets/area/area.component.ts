import { Component, OnInit, Input } from '@angular/core';

import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';

Highcharts.setOptions({
  lang: {
    shortMonths: [
      'Jan', 'Fev', 'Mar', 'Abr', 
      'Mai', 'Jun', 'Jul', 'Ago',
      'Set', 'Out', 'Nov', 'Dez'
    ],
    months: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    shortWeekdays: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  }
});

@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  @Input() private title: string;
  @Input() private data: Highcharts.SeriesOptionsType[] = [];

  Highcharts = Highcharts;
  chartOptions: Highcharts.Options;

  constructor() { }

  ngOnInit(): void {
    this.chartOptions = {
      lang: {
        downloadPNG: 'Download imagem PNG',
        downloadJPEG: 'Download imagem JPEG',
        downloadPDF: 'Download documento PDF',
        downloadSVG: 'Download imagem SVG',
        printChart: 'Imprimir',
        viewFullscreen: 'Tela cheia'
      },
      chart: {type: 'area'},
      title: {text: this.title},
      xAxis: {type: 'datetime'},
      yAxis: {title: {text: null}},
      credits: {enabled: false},
      exporting: {enabled: true},
      series: this.data
    };

    HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}
