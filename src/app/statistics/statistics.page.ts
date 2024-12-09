// src/app/statistics/statistics.page.ts
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-statistics',
  template: `
    <ion-content>
      <div class="layout">
        <app-sidebar></app-sidebar>
        <div class="main-content">
          <h1>ESTADÍSTICAS</h1>
          <div class="charts-container">
            <div class="chart-wrapper">
              <canvas id="lineChart"></canvas>
            </div>
            <div class="chart-wrapper">
              <canvas id="pieChart1"></canvas>
            </div>
            <div class="chart-wrapper">
              <canvas id="pieChart2"></canvas>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./statistics.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SidebarComponent]
})
export class StatisticsPage implements OnInit {
  ngOnInit() {
    this.createLineChart();
    this.createPieChart1();
    this.createPieChart2();
  }

  createLineChart() {
    const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: 'Tareas Completadas',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: '#00BF63',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createPieChart1() {
    const ctx = document.getElementById('pieChart1') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Completadas', 'Pendientes', 'Atrasadas'],
        datasets: [{
          data: [300, 50, 100],
          backgroundColor: ['#00BF63', '#6D39D5', '#B92323']
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  createPieChart2() {
    const ctx = document.getElementById('pieChart2') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Alta', 'Media', 'Baja'],
        datasets: [{
          data: [3, 6, 1],
          backgroundColor: ['#B92323', '#6D39D5', '#00BF63']
        }]
      },
      options: {
        responsive: true
      }
    });
  }
}
