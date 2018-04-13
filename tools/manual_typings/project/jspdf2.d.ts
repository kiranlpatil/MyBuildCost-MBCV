import { jsPDF } from './jspdf';

interface jsPdfPlug {
  fromHTML(HTML: string | HTMLElement, x: number, y: number, settings?: any, callback?: Function, margins?: any): jsPDF;

  save(filename: string): jsPDF;
}

declare var jsPdfPlug: jsPdfPlug;
