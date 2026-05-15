import { useState, useMemo, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine
} from "recharts";

// ── Design tokens (SaaS / corporate) ────────────────────────────────────────
const C = {
  bg:        "#0f1117",
  surface:   "#1a1d27",
  panel:     "#1e2130",
  border:    "#2a2d3e",
  borderHi:  "#3d4166",
  text:      "#e8eaf0",
  muted:     "#8b8fa8",
  subtle:    "#555875",
  red:       "#ef4444",
  redDim:    "#7f1d1d",
  blue:      "#3b82f6",
  blueDim:   "#1e3a5f",
  green:     "#22c55e",
  greenDim:  "#14532d",
  amber:     "#f59e0b",
  amberDim:  "#78350f",
  purple:    "#a855f7",
  purpleDim: "#4c1d95",
  teal:      "#14b8a6",
  white:     "#ffffff",
  // coalition colours
  pnRed:     "#dc2626",
  phBlue:    "#2563eb",
  bnYellow:  "#d97706",
  gpsGreen:  "#16a34a",
  grsTeal:   "#0d9488",
  warPurple: "#9333ea",
  indGray:   "#6b7280",
};

const FONT = "'Inter','Segoe UI',system-ui,sans-serif";

// ── GE-15 Parliament constituency data ──────────────────────────────────────
// [code, state, coalition, party, marginPct, malay%, chinese%, indian%]
// party = individual party within coalition
const SEATS = [
  // Perlis
  ["P.001","Perlis","PN","Bersatu",27.63,86.01,8.14,0.88],
  ["P.002","Perlis","PN","PAS",16.36,81.58,14.73,1.57],
  ["P.003","Perlis","PN","Bersatu",49.62,87.23,7.81,1.59],
  // Kedah
  ["P.004","Kedah","PN","PAS",28.47,89.65,6.75,2.38],
  ["P.005","Kedah","PN","PAS",39.18,90.75,6.78,0.11],
  ["P.006","Kedah","PN","Bersatu",37.87,85.99,8.72,3.38],
  ["P.007","Kedah","PN","PAS",22.54,91.66,1.30,0.14],
  ["P.008","Kedah","PN","PAS",36.10,81.32,15.24,2.48],
  ["P.009","Kedah","PN","PAS",12.90,63.18,31.76,4.26],
  ["P.010","Kedah","PN","Bersatu",27.93,75.96,22.25,1.18],
  ["P.011","Kedah","PN","PAS",41.39,88.47,4.75,0.50],
  ["P.012","Kedah","PN","Bersatu",40.33,80.43,13.03,6.01],
  ["P.013","Kedah","PN","PAS",42.59,92.50,1.46,0.14],
  ["P.014","Kedah","PN","PAS",20.50,69.06,15.30,14.41],
  ["P.015","Kedah","PH","PKR",0.86,60.99,25.75,12.45],
  ["P.016","Kedah","PN","Bersatu",26.72,89.24,4.27,4.63],
  ["P.017","Kedah","PN","PAS",17.79,62.18,17.75,19.36],
  ["P.018","Kedah","PN","Bersatu",18.57,69.73,17.19,12.53],
  // Kelantan
  ["P.019","Kelantan","PN","PAS",33.24,92.28,3.64,0.14],
  ["P.020","Kelantan","PN","PAS",49.21,96.96,1.85,0.12],
  ["P.021","Kelantan","PN","PAS",28.98,84.33,13.75,0.76],
  ["P.022","Kelantan","PN","PAS",47.15,97.29,1.96,0.06],
  ["P.023","Kelantan","PN","PAS",34.09,96.65,1.95,0.07],
  ["P.024","Kelantan","PN","PAS",50.19,97.34,2.00,0.16],
  ["P.025","Kelantan","PN","PAS",33.26,98.26,1.08,0.04],
  ["P.026","Kelantan","PN","PAS",36.76,96.60,1.91,0.08],
  ["P.027","Kelantan","PN","PAS",63.84,94.32,4.11,0.49],
  ["P.028","Kelantan","PN","PAS",35.80,98.04,0.89,0.04],
  ["P.029","Kelantan","PN","PAS",15.59,96.34,3.09,0.16],
  ["P.030","Kelantan","PN","PAS",29.02,97.72,0.18,0.12],
  ["P.031","Kelantan","PN","PAS",38.94,94.12,4.11,1.12],
  ["P.032","Kelantan","PN","Bersatu",0.34,78.55,5.81,0.47],
  // Terengganu
  ["P.033","Terengganu","PN","PAS",21.87,97.97,1.30,0.09],
  ["P.034","Terengganu","PN","PAS",22.43,99.23,0.28,0.04],
  ["P.035","Terengganu","PN","PAS",33.97,98.38,1.05,0.09],
  ["P.036","Terengganu","PN","Bersatu",42.37,90.23,8.65,0.55],
  ["P.037","Terengganu","PN","PAS",38.26,97.53,1.87,0.08],
  ["P.038","Terengganu","PN","PAS",21.85,98.82,0.43,0.04],
  ["P.039","Terengganu","PN","PAS",37.37,95.71,3.16,0.19],
  ["P.040","Terengganu","PN","Bersatu",24.03,93.17,5.06,0.53],
  // Pulau Pinang
  ["P.041","P. Pinang","PN","Bersatu",4.14,79.90,15.50,4.17],
  ["P.042","P. Pinang","PN","Bersatu",18.26,77.93,15.08,6.35],
  ["P.043","P. Pinang","PH","DAP",72.32,14.51,69.32,15.63],
  ["P.044","P. Pinang","PN","Bersatu",6.03,73.12,19.46,6.60],
  ["P.045","P. Pinang","PH","DAP",62.20,21.16,67.38,10.87],
  ["P.046","P. Pinang","PH","DAP",58.69,22.82,54.05,22.27],
  ["P.047","P. Pinang","PH","PKR",20.54,46.75,34.72,17.86],
  ["P.048","P. Pinang","PH","DAP",68.19,15.07,71.12,12.04],
  ["P.049","P. Pinang","PH","DAP",76.30,6.28,81.75,11.24],
  ["P.050","P. Pinang","PH","PKR",54.60,21.02,63.20,14.88],
  ["P.051","P. Pinang","PH","DAP",73.32,14.64,71.69,12.83],
  ["P.052","P. Pinang","PH","DAP",38.91,38.77,47.85,12.18],
  ["P.053","P. Pinang","PH","PKR",2.48,65.23,29.05,4.83],
  // Perak
  ["P.054","Perak","PN","Bersatu",3.98,66.84,13.51,3.03],
  ["P.055","Perak","BN","UMNO",3.18,83.21,11.80,1.38],
  ["P.056","Perak","PN","Bersatu",22.36,89.94,3.92,5.62],
  ["P.057","Perak","PN","Bersatu",10.20,68.43,25.88,5.10],
  ["P.058","Perak","PN","PAS",29.67,78.25,12.36,9.01],
  ["P.059","Perak","PN","Bersatu",17.82,71.25,19.14,9.04],
  ["P.060","Perak","PH","DAP",30.12,39.67,44.38,14.45],
  ["P.061","Perak","PN","Bersatu",10.19,77.87,14.82,6.75],
  ["P.062","Perak","PH","DAP",3.57,34.20,34.67,21.13],
  ["P.063","Perak","PH","PKR",2.98,64.63,20.49,12.48],
  ["P.064","Perak","PH","DAP",55.01,23.08,68.41,7.49],
  ["P.065","Perak","PH","DAP",72.32,13.15,59.11,26.96],
  ["P.066","Perak","PH","DAP",71.82,12.65,69.09,17.59],
  ["P.067","Perak","PN","Bersatu",9.97,70.35,21.02,6.57],
  ["P.068","Perak","PH","PKR",47.07,27.13,56.81,15.17],
  ["P.069","Perak","PN","PAS",5.74,92.34,2.00,2.52],
  ["P.070","Perak","PH","DAP",24.13,34.58,52.64,10.12],
  ["P.071","Perak","PH","DAP",26.20,42.69,44.76,9.63],
  ["P.072","Perak","BN","UMNO",11.38,45.53,24.48,13.90],
  ["P.073","Perak","PN","Bersatu",8.77,80.97,12.21,3.26],
  ["P.074","Perak","PN","Bersatu",0.51,72.20,14.13,11.36],
  ["P.075","Perak","BN","UMNO",0.83,56.44,20.44,21.60],
  ["P.076","Perak","PH","PKR",23.63,41.88,38.36,18.69],
  ["P.077","Perak","PH","Amanah",5.08,54.96,23.65,13.00],
  // Pahang
  ["P.078","Pahang","BN","UMNO",13.66,30.97,27.15,12.19],
  ["P.079","Pahang","BN","UMNO",17.06,78.23,14.76,4.99],
  ["P.080","Pahang","PH","DAP",7.75,52.06,36.59,6.19],
  ["P.081","Pahang","PN","PAS",12.12,82.20,11.77,2.45],
  ["P.082","Pahang","PN","Bersatu",9.00,67.34,25.48,5.58],
  ["P.083","Pahang","PN","Bersatu",4.23,69.03,26.30,3.22],
  ["P.084","Pahang","BN","UMNO",2.12,83.96,11.06,1.92],
  ["P.085","Pahang","BN","UMNO",9.62,84.96,1.79,0.70],
  ["P.086","Pahang","PN","Bersatu",4.43,89.36,5.80,1.38],
  ["P.087","Pahang","PN","PAS",2.14,88.70,2.52,2.07],
  ["P.088","Pahang","PN","Bersatu",6.68,66.28,21.05,8.12],
  ["P.089","Pahang","PH","PKR",1.04,49.25,37.99,9.09],
  ["P.090","Pahang","BN","UMNO",28.04,62.04,27.82,3.66],
  ["P.091","Pahang","PN","PAS",2.15,83.29,2.43,0.89],
  // Selangor
  ["P.092","Selangor","PN","Bersatu",12.34,81.32,13.05,4.88],
  ["P.093","Selangor","PN","Bersatu",5.33,67.33,29.33,2.10],
  ["P.094","Selangor","PN","Bersatu",1.28,62.81,18.14,15.13],
  ["P.095","Selangor","PN","Bersatu",4.26,73.15,17.20,8.23],
  ["P.096","Selangor","PH","PKR",1.16,66.81,12.06,19.55],
  ["P.097","Selangor","PH","PKR",16.30,51.59,26.30,17.90],
  ["P.098","Selangor","PH","Amanah",7.69,69.94,10.86,10.86],
  ["P.099","Selangor","PH","PKR",28.42,51.40,32.44,9.68],
  ["P.100","Selangor","PH","PKR",41.76,40.22,46.97,7.95],
  ["P.101","Selangor","PH","PKR",10.88,63.45,20.97,10.72],
  ["P.102","Selangor","PH","PKR",28.53,48.43,36.96,11.19],
  ["P.103","Selangor","PH","DAP",47.92,37.26,49.40,10.95],
  ["P.104","Selangor","PH","DAP",64.65,26.25,54.04,16.81],
  ["P.105","Selangor","PH","PKR",34.67,46.15,29.56,20.73],
  ["P.106","Selangor","PH","DAP",71.24,20.66,66.14,9.98],
  ["P.107","Selangor","PH","PKR",2.08,62.62,20.70,10.44],
  ["P.108","Selangor","PH","Amanah",13.33,73.36,12.67,11.92],
  ["P.109","Selangor","PN","Bersatu",7.46,68.00,15.26,14.21],
  ["P.110","Selangor","PH","DAP",56.01,26.65,52.77,18.25],
  ["P.111","Selangor","PH","PKR",37.42,39.81,29.68,27.34],
  ["P.112","Selangor","PN","Bersatu",1.48,54.86,23.76,17.28],
  ["P.113","Selangor","PH","PKR",6.49,62.92,19.15,13.14],
  // WP KL
  ["P.114","WP KL","PH","DAP",84.46,5.62,85.51,7.08],
  ["P.115","WP KL","PH","PKR",25.52,44.05,34.57,18.18],
  ["P.116","WP KL","PH","PKR",22.32,57.71,28.51,9.11],
  ["P.117","WP KL","PH","DAP",69.81,26.77,56.76,11.81],
  ["P.118","WP KL","PH","Amanah",16.27,60.52,24.51,11.69],
  ["P.119","WP KL","BN","UMNO",7.61,66.43,16.50,9.31],
  ["P.120","WP KL","PH","DAP",73.63,13.05,71.60,12.41],
  ["P.121","WP KL","PH","PKR",18.13,59.09,19.14,17.18],
  ["P.122","WP KL","PH","DAP",76.83,12.06,76.78,8.96],
  ["P.123","WP KL","PH","DAP",75.89,13.44,77.09,7.77],
  ["P.124","WP KL","PH","PKR",10.55,61.99,26.94,8.77],
  // WP Putrajaya
  ["P.125","WP Putrajaya","PN","Bersatu",6.30,93.85,0.89,2.78],
  // N. Sembilan
  ["P.126","N. Sembilan","BN","UMNO",17.92,65.12,23.33,5.49],
  ["P.127","N. Sembilan","BN","UMNO",8.16,63.63,22.01,12.74],
  ["P.128","N. Sembilan","PH","PKR",25.02,51.29,31.90,13.93],
  ["P.129","N. Sembilan","BN","UMNO",13.32,76.03,15.68,5.25],
  ["P.130","N. Sembilan","PH","DAP",51.79,32.57,42.64,22.38],
  ["P.131","N. Sembilan","BN","UMNO",18.18,73.49,8.86,15.94],
  ["P.132","N. Sembilan","PH","DAP",29.85,43.60,31.87,21.41],
  ["P.133","N. Sembilan","BN","UMNO",2.09,61.93,23.66,12.28],
  // Melaka
  ["P.134","Melaka","PN","Bersatu",8.06,81.95,11.74,3.64],
  ["P.135","Melaka","PH","PKR",1.22,61.39,23.78,13.07],
  ["P.136","Melaka","PN","Bersatu",9.62,69.28,22.29,3.65],
  ["P.137","Melaka","PH","DAP",9.14,61.73,30.62,6.04],
  ["P.138","Melaka","PH","DAP",37.68,38.98,54.17,4.46],
  ["P.139","Melaka","PN","Bersatu",0.41,73.29,15.50,10.12],
  // Johor
  ["P.140","Johor","PH","DAP",11.19,46.70,42.64,9.32],
  ["P.141","Johor","PH","DAP",3.59,57.76,36.58,4.07],
  ["P.142","Johor","PH","DAP",8.15,37.55,43.75,15.36],
  ["P.143","Johor","PN","Bersatu",18.40,66.08,29.25,3.42],
  ["P.144","Johor","PH","PKR",12.16,55.29,38.55,4.89],
  ["P.145","Johor","PH","DAP",26.32,45.39,51.62,2.12],
  ["P.146","Johor","IND","IND",2.53,66.35,31.25,1.34],
  ["P.147","Johor","BN","UMNO",3.21,80.21,18.07,0.47],
  ["P.148","Johor","BN","UMNO",6.35,57.61,37.09,4.14],
  ["P.149","Johor","PH","PKR",6.53,63.69,33.83,1.37],
  ["P.150","Johor","PH","DAP",16.05,52.03,44.72,1.43],
  ["P.151","Johor","BN","UMNO",4.13,60.53,28.69,8.63],
  ["P.152","Johor","PH","PKR",27.62,41.23,46.06,10.43],
  ["P.153","Johor","BN","UMNO",26.58,60.25,27.81,8.80],
  ["P.154","Johor","PN","PAS",4.98,81.18,13.74,1.18],
  ["P.155","Johor","BN","MCA",5.82,72.99,16.36,7.04],
  ["P.156","Johor","BN","UMNO",17.73,88.67,7.96,1.78],
  ["P.157","Johor","BN","UMNO",11.97,89.38,8.06,0.75],
  ["P.158","Johor","PH","PKR",18.29,44.96,38.77,11.44],
  ["P.159","Johor","PH","Amanah",21.14,46.13,36.17,10.21],
  ["P.160","Johor","PH","DAP",16.99,51.42,39.23,5.90],
  ["P.161","Johor","PH","PKR",28.28,44.61,40.12,12.22],
  ["P.162","Johor","PH","DAP",36.68,36.27,47.22,14.10],
  ["P.163","Johor","PH","DAP",31.26,36.96,49.21,11.58],
  ["P.164","Johor","BN","UMNO",10.13,68.25,28.03,1.06],
  ["P.165","Johor","BN","MIC",11.65,57.02,40.05,1.02],
  // Sabah
  ["P.167","Sabah","IND","IND",4.36,4.17,7.06,0.12],
  ["P.168","Sabah","IND","IND",16.37,2.66,2.01,0.08],
  ["P.169","Sabah","IND","IND",8.48,2.92,1.12,0.20],
  ["P.170","Sabah","PH","UPKO",0.40,4.76,4.24,0.23],
  ["P.171","Sabah","PH","PKR",10.02,12.97,17.07,0.54],
  ["P.172","Sabah","PH","DAP",53.91,4.21,59.90,0.98],
  ["P.173","Sabah","BN","UMNO",0.30,18.66,11.76,0.74],
  ["P.174","Sabah","PH","PKR",28.41,4.72,26.71,0.68],
  ["P.175","Sabah","GRS","PBS",28.10,8.92,6.29,0.30],
  ["P.176","Sabah","BN","UMNO",9.78,9.22,2.93,0.18],
  ["P.177","Sabah","BN","UMNO",8.59,7.21,5.44,0.32],
  ["P.178","Sabah","GRS","PBS",16.14,8.07,3.38,0.17],
  ["P.179","Sabah","GRS","GRS",26.22,2.20,1.32,0.08],
  ["P.180","Sabah","GRS","GRS",14.68,5.36,7.08,0.16],
  ["P.181","Sabah","IND","IND",3.87,6.09,8.50,0.08],
  ["P.182","Sabah","BN","UMNO",14.58,1.51,0.94,0.05],
  ["P.183","Sabah","PN","Bersatu",5.43,5.47,0.86,0.11],
  ["P.184","Sabah","BN","UMNO",28.34,28.03,15.12,0.31],
  ["P.185","Sabah","GRS","GRS",17.83,14.83,26.98,0.31],
  ["P.186","Sabah","PH","DAP",35.68,14.39,42.37,0.64],
  ["P.187","Sabah","BN","UMNO",14.75,14.61,0.68,0.14],
  ["P.188","Sabah","IND","IND",7.53,26.42,9.14,0.42],
  ["P.189","Sabah","IND","IND",53.48,6.60,1.52,0.14],
  ["P.190","Sabah","GRS","GRS",7.50,33.96,29.52,0.38],
  ["P.191","Sabah","BN","UMNO",18.19,49.17,8.37,0.36],
  // Sarawak — GPS held
  ["P.192","Sarawak","PH","PKR",17.46,5.14,17.08,0.18],
  ["P.193","Sarawak","GPS","PBB",74.66,78.03,7.92,0.09],
  ["P.194","Sarawak","GPS","PBB",59.81,69.37,13.41,0.59],
  ["P.195","Sarawak","PH","DAP",45.44,4.53,85.26,0.70],
  ["P.196","Sarawak","PH","DAP",9.71,14.56,61.57,0.68],
  ["P.197","Sarawak","GPS","PBB",53.43,55.76,13.26,0.24],
  ["P.198","Sarawak","GPS","SUPP",26.07,4.80,24.91,0.18],
  ["P.199","Sarawak","GPS","PRS",41.77,7.60,10.21,0.17],
  ["P.200","Sarawak","GPS","PBB",66.36,69.99,5.19,0.05],
  ["P.201","Sarawak","GPS","PBB",52.48,70.74,2.70,0.02],
  ["P.202","Sarawak","GPS","SUPP",12.65,10.31,16.81,0.06],
  ["P.203","Sarawak","GPS","PDP",0.52,1.73,7.95,0.05],
  ["P.204","Sarawak","GPS","PBB",42.31,43.65,6.37,0.03],
  ["P.205","Sarawak","PN","PAS",28.62,36.90,6.64,0.03],
  ["P.206","Sarawak","GPS","PBB",73.05,23.26,6.06,0.05],
  ["P.207","Sarawak","GPS","PBB",86.32,5.96,3.83,0.02],
  ["P.208","Sarawak","GPS","SUPP",10.14,4.56,60.65,0.03],
  ["P.209","Sarawak","IND","IND",5.95,0.48,4.98,0.02],
  ["P.210","Sarawak","GPS","PDP",1.31,1.74,11.53,0.02],
  ["P.211","Sarawak","PH","DAP",21.80,4.23,64.96,0.05],
  ["P.212","Sarawak","PH","DAP",11.77,10.40,62.03,0.12],
  ["P.213","Sarawak","GPS","PRS",56.47,3.29,9.89,0.05],
  ["P.214","Sarawak","GPS","PRS",17.31,1.01,3.78,0.02],
  ["P.215","Sarawak","GPS","PRS",56.38,2.37,8.71,0.04],
  ["P.216","Sarawak","GPS","PBB",32.06,0.98,1.81,0.03],
  ["P.217","Sarawak","GPS","PBB",31.49,9.81,25.24,0.10],
  ["P.218","Sarawak","GPS","PBB",34.63,18.39,22.84,0.17],
  ["P.219","Sarawak","PH","PKR",7.88,16.78,46.38,0.32],
  ["P.220","Sarawak","GPS","PBB",24.64,4.52,7.44,0.04],
  ["P.221","Sarawak","GPS","PBB",50.51,25.82,17.48,0.10],
  ["P.222","Sarawak","GPS","PBB",31.18,35.90,9.42,0.12],
  // Warisan seats (Sabah — listed as 3 seats; split across IND entries above for model consistency)
  // Note: Warisan contested and won 3 seats, tracked separately in PARTY_BASE
];

// Peninsular + WP swing states
const SWING_STATES = new Set([
  "Perlis","Kedah","Kelantan","Terengganu","P. Pinang","Perak",
  "Pahang","Selangor","WP KL","WP Putrajaya","N. Sembilan","Melaka","Johor"
]);

// GE-15 base seats by party (official results)
const PARTY_BASE = {
  // PN
  PAS:     43, Bersatu: 31,
  // PH
  DAP:     40, PKR: 31, Amanah: 8, UPKO: 1,
  // BN
  UMNO:    26, MCA: 2, MIC: 2,
  // GPS
  PBB:     14, SUPP: 3, PRS: 4, PDP: 2,
  // GRS
  PBS:     3, GRS: 3,
  // Others
  Warisan: 3, IND: 5,
};

// Coalition membership (for builder)
const COALITION_PARTIES = {
  PN:      ["PAS","Bersatu"],
  PH:      ["PKR","DAP","Amanah","UPKO"],
  BN:      ["UMNO","MCA","MIC"],
  GPS:     ["PBB","SUPP","PRS","PDP"],
  GRS:     ["PBS","GRS"],
  Warisan: ["Warisan"],
  IND:     ["IND"],
};

const COALITION_COLOR = {
  PN: C.pnRed, PH: C.phBlue, BN: C.bnYellow,
  GPS: C.gpsGreen, GRS: C.grsTeal, Warisan: C.warPurple, IND: C.indGray,
};

const PARTY_COLOR = {
  PAS: "#b91c1c", Bersatu: "#ef4444",
  PKR: "#1d4ed8", DAP: "#dc2626", Amanah: "#60a5fa", UPKO: "#93c5fd",
  UMNO: "#d97706", MCA: "#fbbf24", MIC: "#fde68a",
  PBB: "#15803d", SUPP: "#4ade80", PRS: "#86efac", PDP: "#bbf7d0",
  PBS: "#0f766e", GRS: "#2dd4bf",
  Warisan: "#9333ea", IND: "#6b7280",
};

// DUN static data
const DUN = {"10":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":266,"PH":111,"BN":76,"ALONE":36,"GRS":29},"gainer":{"co":"PN","d":57},"loser":{"co":"BN","d":-36},"states":{"Perlis":{"t":15,"o":14,"f":0,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":2,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":10,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":11,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":8,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":13,"m":19,"g":false},"Melaka":{"t":28,"o":2,"f":4,"m":15,"g":false},"Johor":{"t":56,"o":3,"f":4,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":1,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":7},"15":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":297,"PH":102,"BN":57,"ALONE":36,"GRS":26},"gainer":{"co":"PN","d":88},"loser":{"co":"BN","d":-55},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":10,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":13,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":14,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":14,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":13,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":11,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":4,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":9},"20":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":324,"PH":95,"BN":41,"ALONE":33,"GRS":25},"gainer":{"co":"PN","d":115},"loser":{"co":"BN","d":-71},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":12,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":16,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":17,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":17,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":16,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":19,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":9,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":9},"25":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":353,"PH":88,"BN":27,"ALONE":29,"GRS":21},"gainer":{"co":"PN","d":144},"loser":{"co":"BN","d":-85},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":3,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":14,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":19,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":17,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":19,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":17,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":30,"m":29,"g":true},"Sabah":{"t":73,"o":1,"f":18,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":10},"30":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":387,"PH":80,"BN":16,"GRS":15,"ALONE":20},"gainer":{"co":"PN","d":178},"loser":{"co":"BN","d":-96},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":3,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":15,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":21,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":18,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":22,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":19,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":38,"m":29,"g":true},"Sabah":{"t":73,"o":1,"f":35,"m":37,"g":false},"Sarawak":{"t":82,"o":0,"f":0,"m":42,"g":false,"gps":true}},"govt_count":10}};

function snapDunSwing(v) {
  const steps = [10,15,20,25,30];
  const abs = Math.abs(v);
  return String(steps.reduce((a,b) => Math.abs(b-abs) < Math.abs(a-abs) ? b : a));
}

// ── Swing model ──────────────────────────────────────────────────────────────
function computeResults(malaySwing, chineseSwing, indianSwing) {
  const base = { PN:0, PH:0, BN:0, GPS:0, GRS:0, IND:0 };
  const partyBase = { ...PARTY_BASE };
  const flippedToPN = [], flippedFromPN = [];

  for (const [code, state, coalition, party, marginPct, mPct, cPct, iPct] of SEATS) {
    base[coalition] = (base[coalition]||0) + 1;
    if (!SWING_STATES.has(state)) continue;
    const netToPN = (malaySwing*mPct + chineseSwing*cPct + indianSwing*iPct) / 100;
    if (coalition !== "PN") {
      if (netToPN > marginPct/2) flippedToPN.push({ code, coalition, party });
    } else {
      if (-netToPN > marginPct/2) flippedFromPN.push({ code, coalition, party });
    }
  }
  return { base, flippedToPN, flippedFromPN };
}

// ── CSS keyframes injected once ───────────────────────────────────────────────
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: ${C.bg}; }
input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; outline: none; cursor: pointer; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; cursor: pointer; border: 2px solid ${C.bg}; }
input[type=checkbox] { width: 14px; height: 14px; cursor: pointer; accent-color: ${C.blue}; }
@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
@keyframes confettiBounce { 0%,100%{transform:translateY(0) rotate(0deg);} 25%{transform:translateY(-8px) rotate(3deg);} 75%{transform:translateY(-4px) rotate(-2deg);} }
@keyframes slideIn { from { transform:scaleX(0); } to { transform:scaleX(1); } }
.card { background:${C.panel}; border:1px solid ${C.border}; border-radius:8px; }
.tag { display:inline-flex; align-items:center; padding:2px 7px; border-radius:4px; font-size:10px; font-weight:600; letter-spacing:.3px; }
`;

// ── Sub-components ────────────────────────────────────────────────────────────

function Slider({ label, value, onChange, color, min=-60, max=60 }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:color }} />
          <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{label}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, color:C.muted }}>Swing to PN</span>
          <span style={{
            fontSize:13, fontWeight:700, minWidth:50, textAlign:"right",
            color: value > 0 ? C.green : value < 0 ? C.red : C.muted,
            fontVariantNumeric:"tabular-nums"
          }}>
            {value > 0 ? `+${value}%` : `${value}%`}
          </span>
        </div>
      </div>
      <div style={{ position:"relative", height:20, display:"flex", alignItems:"center" }}>
        <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:1, background:C.border, zIndex:1 }} />
        <input
          type="range" min={min} max={max} step={1} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ width:"100%", background:`linear-gradient(to right, ${C.border} 0%, ${color} ${pct}%, ${C.border} ${pct}%)`, position:"relative", zIndex:2, accentColor:color }}
        />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color:C.subtle, marginTop:3, fontVariantNumeric:"tabular-nums" }}>
        <span>−60%</span><span>0</span><span>+60%</span>
      </div>
    </div>
  );
}

function SeatMeter({ pn, total=222, maj=112, gained }) {
  const heldPct  = ((pn - gained) / total) * 100;
  const gainPct  = (gained / total) * 100;
  const majPct   = (maj / total) * 100;
  return (
    <div style={{ position:"relative", height:10, background:C.surface, borderRadius:5, overflow:"hidden" }}>
      <div style={{ position:"absolute", left:0, height:"100%", width:`${heldPct}%`, background:C.pnRed, borderRadius:"5px 0 0 5px", transition:"width .4s ease" }} />
      <div style={{ position:"absolute", left:`${heldPct}%`, height:"100%", width:`${gainPct}%`, background:"#fb923c", transition:"all .4s ease" }} />
      <div style={{ position:"absolute", left:`${majPct}%`, top:-2, bottom:-2, width:2, background:C.white, zIndex:3, borderRadius:1 }} />
    </div>
  );
}

function StatCard({ value, label, sub, color, size=28 }) {
  return (
    <div className="card" style={{ padding:"14px 16px", borderTop:`3px solid ${color}` }}>
      <div style={{ fontSize:size, fontWeight:800, color, fontVariantNumeric:"tabular-nums", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:11, fontWeight:600, color:C.text, marginTop:4 }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{sub}</div>}
    </div>
  );
}

function PartyBlock({ name, seats, delta, color, maxSeats }) {
  const pct = maxSeats > 0 ? Math.min(seats / maxSeats * 100, 100) : 0;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ width:3, height:20, background:color, borderRadius:2, flexShrink:0 }} />
      <span style={{ fontSize:11, fontWeight:600, color:C.text, width:52 }}>{name}</span>
      <div style={{ flex:1, height:4, background:C.surface, borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:2, transition:"width .4s ease" }} />
      </div>
      <span style={{ fontSize:12, fontWeight:700, color:C.text, minWidth:24, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{seats}</span>
      {delta !== 0 && (
        <span style={{ fontSize:10, fontWeight:600, color: delta>0 ? C.green : C.red, minWidth:28, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>
          {delta>0?`+${delta}`:delta}
        </span>
      )}
    </div>
  );
}

// GIF urls (giphy embed links — use embed not share for CORS)
const GIFS = {
  fireworks: "https://media.giphy.com/media/26tOZ42Mg6pbTUPHW/giphy.gif",
  crowd:     "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  winning:   "https://media.giphy.com/media/3oz8xRF0v9WMAUVLNK/giphy.gif",
  short:     "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif",
  lose:      "https://media.giphy.com/media/l1J9EdzfOSgfyueLm/giphy.gif",
};

function MajorityBanner({ pn, maj=112 }) {
  const hasMaj = pn >= maj;
  const closeMaj = pn >= maj-10 && pn < maj;
  const shortfall = maj - pn;
  const [gif, setGif] = useState(null);

  useEffect(() => {
    if (hasMaj) setGif(GIFS.fireworks);
    else if (closeMaj) setGif(GIFS.crowd);
    else setGif(null);
  }, [hasMaj, closeMaj]);

  return (
    <div className="card" style={{
      overflow:"hidden", borderColor: hasMaj ? C.green : closeMaj ? C.amber : C.border,
      borderTop:`3px solid ${hasMaj ? C.green : closeMaj ? C.amber : C.red}`,
      animation:"fadeIn .4s ease", marginBottom:16
    }}>
      <div style={{ display:"flex", gap:0 }}>
        <div style={{ flex:1, padding:"16px 18px" }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:1, textTransform:"uppercase", color: hasMaj ? C.green : closeMaj ? C.amber : C.red, marginBottom:6 }}>
            {hasMaj ? "✓ MAJORITY ACHIEVED" : closeMaj ? "⚡ WITHIN STRIKING DISTANCE" : "✗ NO MAJORITY"}
          </div>
          <div style={{ display:"flex", alignItems:"baseline", gap:8, marginBottom:8 }}>
            <span style={{ fontSize:40, fontWeight:800, color: hasMaj ? C.green : closeMaj ? C.amber : C.red, fontVariantNumeric:"tabular-nums" }}>{pn}</span>
            <span style={{ fontSize:14, color:C.muted }}>/ 222 seats</span>
          </div>
          <div style={{ fontSize:11, color:C.muted }}>
            {hasMaj
              ? `PN has a working majority — ${pn - maj} seats above threshold`
              : `PN needs ${shortfall} more seat${shortfall !== 1 ? "s" : ""} to form government`}
          </div>
        </div>
        {gif && (
          <div style={{ width:140, flexShrink:0, overflow:"hidden", borderLeft:`1px solid ${C.border}` }}>
            <img src={gif} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          </div>
        )}
      </div>
    </div>
  );
}

function CoalitionBuilder({ partySeats }) {
  const allParties = Object.keys(PARTY_BASE);
  const [checked, setChecked] = useState(new Set(["PAS","Bersatu"]));

  const toggle = p => setChecked(prev => {
    const n = new Set(prev);
    n.has(p) ? n.delete(p) : n.add(p);
    return n;
  });

  const totalSeats = [...checked].reduce((s,p) => s + (partySeats[p]||0), 0);
  const hasMaj = totalSeats >= 112;

  const byCoalition = Object.entries(COALITION_PARTIES);

  return (
    <div className="card" style={{ padding:"16px 18px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:C.text }}>Coalition Builder</div>
          <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>Tick parties to build your own government</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:28, fontWeight:800, color: hasMaj ? C.green : C.red, fontVariantNumeric:"tabular-nums" }}>{totalSeats}</div>
          <div style={{ fontSize:9, color: hasMaj ? C.green : C.muted }}>{hasMaj ? "✓ MAJORITY" : `Need ${112-totalSeats} more`}</div>
        </div>
      </div>

      {/* majority bar */}
      <div style={{ height:6, background:C.surface, borderRadius:3, marginBottom:14, overflow:"hidden", position:"relative" }}>
        <div style={{ height:"100%", width:`${Math.min(totalSeats/222*100,100)}%`, background: hasMaj ? C.green : C.blue, borderRadius:3, transition:"width .3s ease" }} />
        <div style={{ position:"absolute", left:`${112/222*100}%`, top:-2, bottom:-2, width:2, background:C.white }} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        {byCoalition.map(([coName, parties]) => (
          <div key={coName} style={{ marginBottom:10 }}>
            <div style={{ fontSize:9, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:COALITION_COLOR[coName]||C.muted, marginBottom:5 }}>{coName}</div>
            {parties.map(p => {
              const seats = partySeats[p] || 0;
              return (
                <label key={p} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4, cursor:"pointer" }}>
                  <input type="checkbox" checked={checked.has(p)} onChange={() => toggle(p)} />
                  <div style={{ width:6, height:6, borderRadius:2, background:PARTY_COLOR[p]||C.muted, flexShrink:0 }} />
                  <span style={{ fontSize:11, color:C.text, flex:1 }}>{p}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:C.muted, fontVariantNumeric:"tabular-nums" }}>{seats}</span>
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("parliament");
  const [subTab, setSubTab] = useState("overview");
  const [malaySwing, setMalaySwing]     = useState(15);
  const [chineseSwing, setChineseSwing] = useState(0);
  const [indianSwing, setIndianSwing]   = useState(0);

  // Inject styles once
  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = STYLE;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Live computation
  const { base, flippedToPN, flippedFromPN } = useMemo(
    () => computeResults(malaySwing, chineseSwing, indianSwing),
    [malaySwing, chineseSwing, indianSwing]
  );

  const flippedToPNSet   = new Set(flippedToPN.map(f=>f.code));
  const flippedFromPNSet = new Set(flippedFromPN.map(f=>f.code));

  // Post-swing coalition seats
  const post = { ...base };
  const partyPost = { ...PARTY_BASE };

  for (const { code, coalition, party } of flippedToPN) {
    post[coalition]--; post.PN = (post.PN||0) + 1;
    if (partyPost[party] !== undefined) partyPost[party]--;
    // attribute flipped seats to Bersatu (dominant PN seat vehicle in peninsular)
    partyPost["Bersatu"] = (partyPost["Bersatu"]||0) + 1;
  }
  for (const { coalition, party } of flippedFromPN) {
    post.PN--; post.PH = (post.PH||0) + 1;
    if (partyPost[party] !== undefined) partyPost[party]--;
    partyPost["PKR"] = (partyPost["PKR"]||0) + 1;
  }

  const pnTotal  = post.PN || 0;
  const pnGained = flippedToPN.length;
  const pnLost   = flippedFromPN.length;
  const hasMaj   = pnTotal >= 112;

  // State breakdown for chart
  const stateMap = {};
  for (const [code, state, coalition] of SEATS) {
    if (!SWING_STATES.has(state)) continue;
    if (!stateMap[state]) stateMap[state] = { held:0, gained:0, other:0 };
    if (coalition === "PN" && !flippedFromPNSet.has(code)) stateMap[state].held++;
    else if (flippedToPNSet.has(code)) stateMap[state].gained++;
    else stateMap[state].other++;
  }
  const parlChart = Object.entries(stateMap)
    .map(([st, v]) => ({
      name: st.replace("WP KL","KL").replace("WP Putrajaya","Putrajaya").replace("N. Sembilan","N.Semb").replace("P. Pinang","P.Pinang"),
      held: v.held, gained: v.gained, other: v.other
    }))
    .filter(d => d.held + d.gained > 0)
    .sort((a,b) => (b.held+b.gained)-(a.held+a.gained));

  // Coalitions table
  const coalitions = ["PN","PH","BN","GPS","GRS","IND"];
  let gainerCo="PN", gainerD=0, loserCo="PH", loserD=0;
  for (const co of coalitions) {
    const d = (post[co]||0) - (base[co]||0);
    if (d > gainerD) { gainerD=d; gainerCo=co; }
    if (d < loserD)  { loserD=d;  loserCo=co; }
  }

  // DUN
  const dunSwing = snapDunSwing(malaySwing);
  const dn = DUN[dunSwing];
  const dunChart = Object.entries(dn.states).map(([st,v]) => ({
    name: st.replace("P. Pinang","P.Pinang").replace("N. Sembilan","N.Semb"),
    orig:v.o, flip:v.f, total:v.t, maj:v.m, other:v.t-v.o-v.f, fg:v.g, gps:!!v.gps
  })).sort((a,b) => a.gps-b.gps || (b.orig+b.flip)/b.total-(a.orig+a.flip)/a.total);

  // Party data for builder (post-swing)
  const partySeatsForBuilder = { ...partyPost };

  // ── Render ───────────────────────────────────────────────────────────────
  const sideW = 260;

  return (
    <div style={{ fontFamily:FONT, background:C.bg, color:C.text, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

      {/* ── Top navbar ── */}
      <header style={{ height:52, background:C.surface, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:16, flexShrink:0, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:2, background:C.pnRed, boxShadow:`0 0 8px ${C.pnRed}` }} />
          <div style={{ width:8, height:8, borderRadius:2, background:C.phBlue }} />
          <div style={{ width:8, height:8, borderRadius:2, background:C.bnYellow }} />
        </div>
        <span style={{ fontSize:13, fontWeight:700, color:C.text, letterSpacing:-.3 }}>Malaysia GE-15 · Swing Simulator</span>
        <div style={{ flex:1 }} />
        <span className="tag" style={{ background:C.surface, border:`1px solid ${C.borderHi}`, color:C.muted }}>
          GE-15 Base · 222 Seats
        </span>
        <button
          onClick={() => { setMalaySwing(0); setChineseSwing(0); setIndianSwing(0); }}
          style={{ fontSize:11, fontWeight:600, padding:"5px 12px", background:"transparent", border:`1px solid ${C.border}`, borderRadius:5, cursor:"pointer", color:C.muted, fontFamily:FONT }}
        >
          Reset
        </button>
      </header>

      <div style={{ display:"flex", flex:1, minHeight:0 }}>

        {/* ── Left sidebar — sliders ── */}
        <aside style={{ width:sideW, flexShrink:0, background:C.surface, borderRight:`1px solid ${C.border}`, padding:"20px 16px", overflowY:"auto" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:C.muted, marginBottom:14 }}>Vote Swing to PN</div>

          <Slider label="Malay"   value={malaySwing}   onChange={setMalaySwing}   color="#ef4444" />
          <Slider label="Chinese" value={chineseSwing} onChange={setChineseSwing} color="#3b82f6" />
          <Slider label="Indian"  value={indianSwing}  onChange={setIndianSwing}  color="#22c55e" />

          <div style={{ fontSize:9, color:C.subtle, lineHeight:1.6, padding:"10px 0", borderTop:`1px solid ${C.border}`, marginTop:4 }}>
            Positive = swing toward PN<br/>
            Model: race × voter share per constituency<br/>
            Peninsular + WP only · ±60% range
          </div>

          {/* Quick summary in sidebar */}
          <div style={{ marginTop:16, borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:C.muted, marginBottom:10 }}>Live Result</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {coalitions.map(co => {
                const pre = base[co]||0, cur = post[co]||0, d = cur-pre;
                if (pre===0 && cur===0) return null;
                return (
                  <div key={co} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:3, height:16, background:COALITION_COLOR[co]||C.muted, borderRadius:2 }} />
                    <span style={{ fontSize:11, fontWeight:600, color:C.text, width:36 }}>{co}</span>
                    <div style={{ flex:1, height:3, background:C.border, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${cur/222*100}%`, background:COALITION_COLOR[co]||C.muted, transition:"width .3s" }} />
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:C.text, minWidth:20, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{cur}</span>
                    {d!==0 && <span style={{ fontSize:9, color:d>0?C.green:C.red, minWidth:22, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{d>0?`+${d}`:d}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main style={{ flex:1, overflowY:"auto", padding:"20px 20px 40px" }}>

          {/* Majority banner */}
          <MajorityBanner pn={pnTotal} />

          {/* Seat meter */}
          <div className="card" style={{ padding:"14px 18px", marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:600 }}>PN Seat Projection · {pnTotal} / 222</span>
              <div style={{ display:"flex", gap:10, alignItems:"center", fontSize:10, color:C.muted }}>
                <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:8, height:8, background:C.pnRed, borderRadius:2, display:"inline-block" }} />Held</span>
                <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:8, height:8, background:"#fb923c", borderRadius:2, display:"inline-block" }} />Gained</span>
                <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:2, height:10, background:C.white, borderRadius:1, display:"inline-block" }} />Majority (112)</span>
              </div>
            </div>
            <SeatMeter pn={pnTotal} gained={pnGained} />
          </div>

          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:16 }}>
            <StatCard value={pnTotal}                label="PN Seats"     sub={hasMaj ? `+${pnTotal-112} above maj.` : `${112-pnTotal} short`} color={hasMaj?C.green:C.red} />
            <StatCard value={`+${pnGained}`}         label="Seats Gained" sub="flipped to PN"    color={C.amber} />
            <StatCard value={pnLost>0?`-${pnLost}`:"0"} label="Seats Lost" sub="lost from PN"   color={pnLost>0?C.red:C.muted} />
            <StatCard value={loserD}                  label={`${loserCo} loss`} sub="biggest loser"  color={C.red} />
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:2, marginBottom:16, background:C.surface, borderRadius:8, padding:3, border:`1px solid ${C.border}`, width:"fit-content" }}>
            {[{k:"overview",l:"Overview"},{k:"parties",l:"Parties"},{k:"states",l:"State DUN"},{k:"builder",l:"Coalition Builder"}].map(t => (
              <button key={t.k} onClick={() => setSubTab(t.k)} style={{
                padding:"6px 14px", background: subTab===t.k ? C.panel : "transparent",
                border: subTab===t.k ? `1px solid ${C.borderHi}` : "1px solid transparent",
                borderRadius:6, cursor:"pointer", fontSize:11, fontWeight:subTab===t.k?700:500,
                color: subTab===t.k ? C.text : C.muted, fontFamily:FONT, transition:"all .15s"
              }}>{t.l}</button>
            ))}
          </div>

          {/* ── Overview tab ── */}
          {subTab === "overview" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {/* Coalition changes */}
              <div className="card" style={{ padding:"16px 18px" }}>
                <div style={{ fontSize:12, fontWeight:700, marginBottom:12 }}>Coalition Changes</div>
                {coalitions.map(co => {
                  const pre=base[co]||0, cur=post[co]||0, d=cur-pre;
                  if (pre===0&&cur===0) return null;
                  return (
                    <div key={co} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderBottom:`1px solid ${C.border}` }}>
                      <div style={{ width:3, height:18, background:COALITION_COLOR[co]||C.muted, borderRadius:2 }} />
                      <span style={{ fontSize:12, fontWeight:600, width:40 }}>{co}</span>
                      {co===gainerCo && <span className="tag" style={{ background:C.greenDim, color:C.green }}>GAINER</span>}
                      {co===loserCo  && <span className="tag" style={{ background:C.redDim,   color:C.red   }}>LOSER</span>}
                      <span style={{ flex:1 }} />
                      <span style={{ fontSize:10, color:C.muted, fontVariantNumeric:"tabular-nums" }}>{pre}</span>
                      <span style={{ fontSize:10, color:C.subtle }}>→</span>
                      <span style={{ fontSize:12, fontWeight:700, fontVariantNumeric:"tabular-nums", color:d>0?C.green:d<0?C.red:C.muted }}>{cur}</span>
                      <span style={{ fontSize:10, fontWeight:600, color:d>0?C.green:d<0?C.red:C.muted, minWidth:30, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{d>0?`+${d}`:d===0?"":d}</span>
                    </div>
                  );
                })}
              </div>

              {/* State chart */}
              <div className="card" style={{ padding:"16px 18px" }}>
                <div style={{ fontSize:12, fontWeight:700, marginBottom:12 }}>PN by State (Peninsular + WP)</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={parlChart} layout="vertical" margin={{ left:68, right:8, top:0, bottom:0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                    <XAxis type="number" tick={{ fill:C.muted, fontSize:8, fontFamily:FONT }} />
                    <YAxis type="category" dataKey="name" tick={{ fill:C.text, fontSize:8, fontFamily:FONT }} width={64} />
                    <Tooltip
                      contentStyle={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:6, fontSize:10, fontFamily:FONT }}
                      formatter={(v,n) => [v, n==="held"?"Held":n==="gained"?"Gained":"Others"]}
                    />
                    <Bar dataKey="held"   stackId="a" fill={C.pnRed}  radius={0} />
                    <Bar dataKey="gained" stackId="a" fill="#fb923c" radius={0} />
                    <Bar dataKey="other"  stackId="a" fill={C.border} radius={[0,3,3,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── Parties tab ── */}
          {subTab === "parties" && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              {Object.entries(COALITION_PARTIES).map(([coName, parties]) => {
                const maxSeats = Math.max(...parties.map(p => partyPost[p]||0), 1);
                return (
                  <div key={coName} className="card" style={{ padding:"14px 16px", borderTop:`3px solid ${COALITION_COLOR[coName]||C.border}` }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                      <span style={{ fontSize:12, fontWeight:700 }}>{coName}</span>
                      <span style={{ fontSize:11, color:C.muted, fontVariantNumeric:"tabular-nums" }}>
                        {parties.reduce((s,p)=>s+(partyPost[p]||0),0)} seats
                      </span>
                    </div>
                    {parties.map(p => {
                      const base = PARTY_BASE[p]||0;
                      const cur  = partyPost[p]||0;
                      const d    = cur - base;
                      return <PartyBlock key={p} name={p} seats={cur} delta={d} color={PARTY_COLOR[p]||C.muted} maxSeats={maxSeats} />;
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── State DUN tab ── */}
          {subTab === "states" && (
            <div>
              <div className="card" style={{ padding:"10px 14px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:11, color:C.muted }}>DUN follows Malay slider · snapped to nearest model step</span>
                <span style={{ fontSize:12, fontWeight:700, color:C.pnRed }}>Malay swing: {dunSwing}%</span>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                <div className="card" style={{ padding:"12px 14px", borderLeft:`3px solid ${C.green}` }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:C.green }}>DUN Gainer</div>
                  <div style={{ fontSize:18, fontWeight:800, color:C.green, fontVariantNumeric:"tabular-nums" }}>{dn.gainer.co} +{dn.gainer.d}</div>
                </div>
                <div className="card" style={{ padding:"12px 14px", borderLeft:`3px solid ${C.red}` }}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:C.red }}>DUN Loser</div>
                  <div style={{ fontSize:18, fontWeight:800, color:C.red, fontVariantNumeric:"tabular-nums" }}>{dn.loser.co} {dn.loser.d}</div>
                </div>
              </div>

              <div style={{ display:"grid", gap:8 }}>
                {dunChart.map(d => {
                  const pnN = d.orig + d.flip;
                  return d.gps ? (
                    <div key={d.name} className="card" style={{ padding:"10px 14px", borderLeft:`3px solid ${C.gpsGreen}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:11, fontWeight:600 }}>{d.name}</span>
                        <span className="tag" style={{ background:C.greenDim, color:C.gpsGreen }}>GPS · 82 seats · outside swing model</span>
                      </div>
                    </div>
                  ) : (
                    <div key={d.name} className="card" style={{ padding:"10px 14px", borderLeft:`3px solid ${d.fg?C.green:C.border}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <span style={{ fontSize:11, fontWeight:600 }}>{d.name}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:d.fg?C.green:C.red, fontVariantNumeric:"tabular-nums" }}>
                          {d.fg?"✓":"✗"} PN {pnN}/{d.total}
                        </span>
                      </div>
                      <div style={{ height:5, background:C.surface, borderRadius:3, overflow:"hidden", position:"relative" }}>
                        <div style={{ position:"absolute", height:"100%", width:`${(d.orig/d.total)*100}%`, background:C.pnRed }} />
                        <div style={{ position:"absolute", height:"100%", left:`${(d.orig/d.total)*100}%`, width:`${(d.flip/d.total)*100}%`, background:"#fb923c" }} />
                        <div style={{ position:"absolute", left:`${(d.maj/d.total)*100}%`, top:0, bottom:0, width:2, background:C.white }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Coalition Builder tab ── */}
          {subTab === "builder" && (
            <CoalitionBuilder partySeats={partySeatsForBuilder} />
          )}

        </main>
      </div>

      <footer style={{ background:C.surface, borderTop:`1px solid ${C.border}`, padding:"8px 20px", fontSize:9, color:C.subtle, display:"flex", justifyContent:"space-between" }}>
        <span>TindakMalaysia GE-15 voter roll (Oct 2022) · MECo CC0 · Constituency race-weighted model · Hypothetical</span>
        <span>GE-15 base: 19 Nov 2022</span>
      </footer>
    </div>
  );
}
