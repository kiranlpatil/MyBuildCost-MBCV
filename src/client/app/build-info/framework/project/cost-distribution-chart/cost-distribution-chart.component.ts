import { AfterViewInit, Component, Input, OnChanges } from '@angular/core';
import { BuildingReport } from '../../model/building-report';
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
  private isShowBudgetedCostLabel:boolean;

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
    let budgetedCostsHeadList=[];//array fo array(costHeadName,amount)
    let estimatedCostsHeadList=[];
    this.isShowBudgetedCostLabel=false;//array fo array(costHeadName,amount)
    for (let estimateCost of this.buildingReport.estimate.estimatedCosts) {
      if (estimateCost.total > 0) {
        estimatedCostsHeadList.push([estimateCost.name, estimateCost.total]);
      } else {
        let amount= this.buildingReport.thumbRule.thumbRuleReports[this.buildingReport.estimate.estimatedCosts.
        indexOf(estimateCost)].amount;
        let name= this.buildingReport.thumbRule.thumbRuleReports[this.buildingReport.estimate.estimatedCosts.
        indexOf(estimateCost)].name;
        budgetedCostsHeadList.push(['<span class="glyphicon glyphicon-star" style="color:#C0C0C0;"></span>'
                                     +name,amount]);
      }
    }
    let data = this.createDataForChart(estimatedCostsHeadList, budgetedCostsHeadList);
    if (document.getElementById(this.chartID)) {
      this.showCostDistributionChart(data);
    }
  }

  private showCostDistributionChart(data: any) {
    var chart =  Highcharts.chart(this.chartID, {
      chart: {
        type: 'pie',
        plotBackgroundColor: '#f7f7f7',
        plotBorderWidth: 0,
        plotShadow: false,
        colorCount: 50,
        backgroundColor: '#f7f7f7',
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        spacingBottom: 0,
        height: 590,
      },
      title: {
        text: this.buildingReport.name + ',<br>Construction Cost:<br>' + '(Material+Labour)',
        align: 'center',
        verticalAlign: 'middle',
        y: -100,
        style: {
          fontSize: '1em'
        }
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>'
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -150,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          showInLegend: true,
          startAngle: 0,
          endAngle: 360,
          center: ['50%', '36%'],
          events: {
            afterAnimate: function() {
              let chart = this.chart;
              let legend = chart.legend;
              let tooltip = this.chart.tooltip;
              for (let item of legend.allItems) {
                item.legendItem.on('mouseover', function (e:any) {
                  let data = item.series.data[item.index];
                  tooltip.refresh(data);
                }).on('mouseout', function (e:any) {
                  tooltip.hide();
                });
              }
            }
          }
        }
      },
      series: [{
        name: 'Cost Distribution',
        innerSize: '60%',
        data: data,
      }],
      legend: {
        useHTML:true,
        symbolRadius:0,
        labelFormat: '{percentage:.0f}% {name}',
        layout: 'vertical',
        itemWidth: 150,
        maxHeight: 300,
        y: 320,
        itemMarginTop: 5,
        //margin: 0,
        //padding: 0,
        verticalAlign: 'top'
      },
      colors: ['#e7bc00', '#3bc698', '#315967', '#6b9bab', '#ff9a9e', '#0097ca', '#ed4731',
        '#37c2c3', '#f26424', '#434348', '#9ec000', '#e7bc00']
    });
  }

  private createDataForChart(estimatedCostsHeadList: any, budgetedCostsHeadList: any) {debugger
   let costHeadList=estimatedCostsHeadList.concat(budgetedCostsHeadList);
    costHeadList.sort((a:[string,number], b:[string,number]) => {
      return a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0;
    });
    let chartData = new Array();
    let other: number = 0;
    for (let costHead of costHeadList) {
      if (chartData.length < 10) {
        if(budgetedCostsHeadList.indexOf(costHead)!==-1) {
          this.isShowBudgetedCostLabel=true;}
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
