import {AfterViewInit, Component, Input, OnChanges} from '@angular/core';
import {BuildingReport} from '../../model/building-report';
import * as Highcharts from 'highcharts';

@Component({
  moduleId: module.id,
  selector: 'cost-distribution-chart',
  styleUrls: ['cost-distribution-chart.component.css'],
  templateUrl: 'cost-distribution-chart.component.html'
})

export class CostDistributionChartComponent implements AfterViewInit, OnChanges {
  @Input() buildingReport: BuildingReport;
  private chartID: string = 'chart'; //TODO remove this

  ngOnChanges() {
    if (!this.buildingReport)
      return;
    if (document.getElementById(this.chartID)) {
      this.triggerChart();
    }
  }

  ngAfterViewInit() {
    if (!this.buildingReport)
      return;
    this.triggerChart();
  }

  private triggerChart() {
    let costsHeadList=[];//array fo array(costHeadName,total)
    let notEstimated: number = 0;
    for (let estimateCost of this.buildingReport.estimate.estimatedCosts) {
      if (estimateCost.total > 0) {
        costsHeadList.push([estimateCost.name, estimateCost.total]);
      } else {
        notEstimated += this.buildingReport.thumbRule.thumbRuleReports[this.buildingReport.estimate.estimatedCosts.
                        indexOf(estimateCost)].amount;
      }
    }
    let data = this.createDataForChart(costsHeadList, notEstimated);
    if (document.getElementById(this.chartID)) {
      this.showCostDistributionChart(data);
    }
  }

  private showCostDistributionChart(data: any) {
    Highcharts.chart(this.chartID, {
      chart: {
        plotBackgroundColor: '#f7f7f7',
        plotBorderWidth: 0,
        plotShadow: false,
        colorCount: 50
      },
      title: {
        text: this.buildingReport.name + ',<br>Construction Cost:<br>' + '(Material+Labour)',
        align: 'center',
        verticalAlign: 'middle'
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          showInLegend: true,
          startAngle: 0,
          endAngle: 360,
          center: ['50%', '75%']
        }
      },
      series: [{
        type: 'pie',
        name: 'Cost Distribution',
        innerSize: '50%',
        data: data,
      }],
      legend: {
        layout: 'vertical'
      },
      colors: ['#434348', '#3bc698', '#315967', '#6b9bab', '#ff9a9e', '#0097ca', '#ed4731',
        '#37c2c3', '#f26424', '#a1c4fd', '#9ec000', '#e7bc00']
    });
  }

  private createDataForChart(costsHeadList: any, notEstimated: any) {
    costsHeadList.sort((a:[string,number], b:[string,number]) => {
      return a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0;
    });

    let chartData = new Array();
    let other: number = 0;
    for (let costHead of costsHeadList) {
      if (chartData.length < 10) {
        chartData.push({
          name: costHead[0],
          y: costHead[1],
          dataLabels: {
            enabled: false
          }
        });
      } else {
        other += costHead[1];
      }
    }

    if (notEstimated > 0) {
      chartData.push({
        name: 'Not Estimated',
        y: notEstimated,
        dataLabels: {
          enabled: false
        },
        color: '#e7bc00'
      });
    }

    if (other > 0) {
      chartData.push({
        name: 'Other',
        y: other,
        dataLabels: {
          enabled: false
        },
        color: '#9ec000'
      });
    }

    return chartData;
  }
}
